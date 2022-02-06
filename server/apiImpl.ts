import axios, { AxiosInstance } from 'axios'
import { GraphQLClient, gql } from 'graphql-request'
import log from 'loglevel'
import { checkToken } from './checkToken'
import { conditionalRequest } from './conditionalRequest'
import { getErrorMessage } from './errorUtils'

const MAX_REPOS_PER_PAGE = 100
const MAX_PARALLEL_TRAFFIC_CALLS = 25

const REPOS_QUERY = gql`
  query ReposQuery($query: String!, $first: Int!, $after: String) {
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

export async function* runGraphQLQuery(
  client: GraphQLClient,
  query: string,
  variables: object,
  repoLimit: number
): AsyncGenerator<any> {
  let yieldedSoFar = 0
  for (; ;) {
    const data = await client.request(query, variables)
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

const displayRateLimitData = async (axiosInstance: AxiosInstance, when: string) => {
  const { data } = await axiosInstance.get('/rate_limit')
  const core = data.resources.core
  const { limit, used, remaining } = core
  const reset = new Date(core.reset * 1000).toLocaleString()
  log.info(`[displayRateLimitData (${when})] limit: ${limit}; used: ${used}; remaining: ${remaining}; reset: ${reset}`)
  return data
}

export const getReposImpl = async (clientId: string, clientSecret: string, token: string, repoLimit: number) => {

  const checkTokenData = await checkToken(clientId, clientSecret, token)
  if (!checkTokenData) {
    return { badToken: true }
  }
  const appName = checkTokenData.app.name
  const appUrl = checkTokenData.app.url
  const login = checkTokenData.user.login
  const reposUrl = checkTokenData.user.repos_url
  log.info('[getReposImpl]', 'appName:', appName, 'appUrl:', appUrl, 'login:', login, 'reposUrl:', reposUrl)

  try {
    const axiosInstance = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${token}`
      }
    })

    const client = new GraphQLClient(
      'https://api.github.com/graphql',
      {
        headers: {
          'Authorization': `bearer ${token}`
        }
      }
    )

    await displayRateLimitData(axiosInstance, 'before')

    const variables = {
      first: MAX_REPOS_PER_PAGE,
      query: `user:${login} fork:false`
    }

    const asyncReposIter = runGraphQLQuery(client, REPOS_QUERY, variables, repoLimit)

    const results: any[] = []

    for await (const reposChunk of asyncSplitEvery(asyncReposIter, MAX_PARALLEL_TRAFFIC_CALLS)) {
      log.info('[getReposImpl]', 'reposChunk.length:', reposChunk.length)
      const viewsPromises = reposChunk.map(repo => conditionalRequest(axiosInstance, `/repos/${login}/${repo.name}/traffic/views`))
      const clonesPromises = reposChunk.map(repo => conditionalRequest(axiosInstance, `/repos/${login}/${repo.name}/traffic/clones`))
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
    await displayRateLimitData(axiosInstance, 'after')
    return { success: results }
  } catch (e: unknown) {
    log.error('[getReposImpl]', getErrorMessage(e))
    return { error: true }
  }
}
