import axios, { AxiosInstance } from 'axios'
import { GraphQLClient, RequestDocument, Variables, gql } from 'graphql-request'
import log from 'loglevel'
import { checkToken } from './checkToken'
import { conditionalRequest } from './conditionalRequest'
import { getErrorMessage } from './errorUtils'
import * as C from './constants'

const MAX_REPOS_PER_PAGE = 100
const MAX_PARALLEL_TRAFFIC_CALLS = 25

const REPOS_QUERY = gql`
  query ReposQuery($query: String!, $first: Int!, $after: String) {

    rateLimit {
      cost
      limit
      remaining
      resetAt
      used
    }

    search(type: REPOSITORY, query: $query, first: $first, after: $after) {
      nodes {
        ... on Repository {
          id
          name
          description
          url
          createdAt
          updatedAt
          forkCount
          stargazerCount
          primaryLanguage {
            name
            color
          }
          owner {
            login
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`

export async function* asyncSplitEvery<T>(xs: AsyncGenerator<T>, n: number): AsyncGenerator<T[]> {
  let chunk: T[] = []
  for await (const x of xs) {
    chunk.push(x)
    if (chunk.length === n) {
      yield chunk
      chunk = []
    }
  }
  if (chunk.length > 0) {
    yield chunk
  }
}

async function* runGraphQLQuery(
  client: GraphQLClient,
  query: RequestDocument,
  variables: Variables,
  repoLimit: number
): AsyncGenerator<any> {
  let yieldedSoFar = 0
  for (; ;) {
    const data = await client.request(query, variables)
    log.info('[runGraphQLQuery]', 'rateLimit:', data.rateLimit)
    const hasNextPage = data.search.pageInfo.hasNextPage
    const after = data.search.pageInfo.endCursor
    const repos = data.search.nodes
    const reposCount = repos.length
    if (repoLimit <= 0) {
      yield* repos
    } else {
      const remainingLimit = repoLimit - yieldedSoFar
      if (remainingLimit < reposCount) {
        yield* repos.slice(0, remainingLimit)
        break
      } else {
        yield* repos
        yieldedSoFar += reposCount
      }
    }
    if (hasNextPage) {
      (variables as any).after = after
    } else {
      break
    }
  }
}

const displayV3RateLimitData = async (axiosInstance: AxiosInstance, when: string) => {
  const { data } = await axiosInstance.get('/rate_limit')
  const core = data.resources.core
  const { limit, used, remaining } = core
  const reset = new Date(core.reset * 1000).toLocaleString()
  log.info(`[displayV3RateLimitData (${when})] limit: ${limit}; used: ${used}; remaining: ${remaining}; reset: ${reset}`)
  return data
}

const makeTrafficUrl = (repo: any, trafficType: string) =>
  `/repos/${repo.owner.login}/${repo.name}/traffic/${trafficType}`

export const getReposImpl = async (clientId: string, clientSecret: string, token: string, repoLimit: number) => {

  const checkTokenData = await checkToken(clientId, clientSecret, token)
  if (!checkTokenData) {
    return { badToken: true }
  }
  const appName = checkTokenData.app.name
  const appUrl = checkTokenData.app.url
  const login = checkTokenData.user.login
  log.info('[getReposImpl]', { appName, appUrl, login })

  try {
    const axiosInstance = axios.create({
      baseURL: C.GITHUB_API_URL_V3,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${token}`
      }
    })

    await displayV3RateLimitData(axiosInstance, 'before')

    const client = new GraphQLClient(
      C.GITHUB_API_URL_V4,
      {
        headers: {
          'Authorization': `bearer ${token}`
        }
      }
    )

    const variables = {
      first: MAX_REPOS_PER_PAGE,
      query: `user:${login} fork:true`
    }

    const asyncReposIter = runGraphQLQuery(client, REPOS_QUERY, variables, repoLimit)

    const results: any[] = []

    for await (const reposChunk of asyncSplitEvery(asyncReposIter, MAX_PARALLEL_TRAFFIC_CALLS)) {
      log.info('[getReposImpl]', 'reposChunk.length:', reposChunk.length)
      const viewsPromises = reposChunk.map(repo => conditionalRequest(axiosInstance, makeTrafficUrl(repo, 'views')))
      const clonesPromises = reposChunk.map(repo => conditionalRequest(axiosInstance, makeTrafficUrl(repo, 'clones')))
      const responses = await Promise.all([...viewsPromises, ...clonesPromises])
      const viewsResults = responses.slice(0, reposChunk.length)
      const clonesResults = responses.slice(reposChunk.length)
      reposChunk.forEach((repo: any, index: number) => {
        results.push({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          createdAt: repo.createdAt,
          updatedAt: repo.updatedAt,
          htmlUrl: repo.url,
          language: repo.primaryLanguage?.name,
          languageColour: repo.primaryLanguage?.color,
          stars: repo.stargazerCount,
          forks: repo.forkCount,
          views: viewsResults[index].data.count,
          viewers: viewsResults[index].data.uniques,
          clones: clonesResults[index].data.count,
          cloners: clonesResults[index].data.uniques
        })
      })
    }
    await displayV3RateLimitData(axiosInstance, 'after')
    return { success: results }
  } catch (e: unknown) {
    const errorMessage = getErrorMessage(e)
    log.error('[getReposImpl]', errorMessage)
    return { error: true, errorMessage }
  }
}
