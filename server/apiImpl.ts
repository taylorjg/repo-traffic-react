import axios, { AxiosInstance } from 'axios'
import { GraphQLClient, gql } from 'graphql-request'
import log from 'loglevel'
import { checkToken } from './checkToken'
import { conditionalRequest } from './conditionalRequest'
import { getErrorMessage } from './errorUtils'
import { splitEvery } from './utils'
import * as C from './constants'

const MAX_REPOS_PER_PAGE = 100
const MAX_PARALLEL_TRAFFIC_CALLS = 25

const USER_QUERY = gql`
  query UserQuery($login: String!) {

    user(login: $login) {
      login
      name
      bio
      location
      company
      url
      avatarUrl
      websiteUrl
    }

    rateLimit {
      cost
      limit
      remaining
      resetAt
      used
    }
  }
`

const REPOS_QUERY = gql`
  query ReposQuery($query: String!, $first: Int!, $after: String) {

    search(type: REPOSITORY, query: $query, first: $first, after: $after) {
      nodes {
        ... on Repository {
          id
          name
          description
          url
          homepageUrl
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
          # https://stackoverflow.com/a/48290822
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 1) {
                  edges {
                    node {
                      ... on Commit {
                        committedDate
                      }
                    }
                  }
                }
              }
            }
          }          
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }

    rateLimit {
      cost
      limit
      remaining
      resetAt
      used
    }
  }
`

const runUserQuery = async (
  client: GraphQLClient,
  login: string
) => {
  const variables = {
    login
  }
  const data = await client.request(USER_QUERY, variables)
  log.info('[runUserQuery]', 'user:', data.user)
  log.info('[runUserQuery]', 'rateLimit:', data.rateLimit)
  return data.user
}

const runReposQuery = async (
  client: GraphQLClient,
  login: string,
  repoLimit: number
) => {
  const variables = {
    query: `user:${login} fork:true sort:updated-desc`,
    first: MAX_REPOS_PER_PAGE,
    after: undefined
  }

  const accumulatedRepos: any[] = []

  for (; ;) {
    if (repoLimit > 0) {
      const remaining = repoLimit - accumulatedRepos.length
      variables.first = Math.min(MAX_REPOS_PER_PAGE, remaining)
    }

    const data = await client.request(REPOS_QUERY, variables)
    log.info('[runReposQuery]', 'rateLimit:', data.rateLimit, 'fetched:', data.search.nodes.length)

    const hasNextPage = data.search.pageInfo.hasNextPage
    const after = data.search.pageInfo.endCursor
    const repos = data.search.nodes

    accumulatedRepos.push(...repos)

    if (repoLimit > 0 && accumulatedRepos.length >= repoLimit) break

    if (hasNextPage) {
      variables.after = after
    } else {
      break
    }
  }

  return repoLimit > 0 ? accumulatedRepos.slice(0, repoLimit) : accumulatedRepos
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

    const user = await runUserQuery(client, login)
    const rawRepos = await runReposQuery(client, login, repoLimit)
    const rawReposInChunks = Array.from(splitEvery(rawRepos, MAX_PARALLEL_TRAFFIC_CALLS))

    const repos: any[] = []

    for (const rawReposChunk of rawReposInChunks) {
      log.info('[getReposImpl]', 'rawReposChunk.length:', rawReposChunk.length)
      const viewsPromises = rawReposChunk.map(rawRepo => conditionalRequest(axiosInstance, makeTrafficUrl(rawRepo, 'views')))
      const clonesPromises = rawReposChunk.map(rawRepo => conditionalRequest(axiosInstance, makeTrafficUrl(rawRepo, 'clones')))
      const responses = await Promise.all([...viewsPromises, ...clonesPromises])
      const viewsResults = responses.slice(0, rawReposChunk.length)
      const clonesResults = responses.slice(rawReposChunk.length)
      rawReposChunk.forEach((rawRepo: any, index: number) => {
        repos.push({
          id: rawRepo.id,
          name: rawRepo.name,
          description: rawRepo.description,
          createdAt: rawRepo.createdAt,
          updatedAt: rawRepo.updatedAt,
          lastCommitAt: rawRepo.defaultBranchRef.target.history.edges[0].node.committedDate,
          htmlUrl: rawRepo.url,
          homepageUrl: rawRepo.homepageUrl,
          language: rawRepo.primaryLanguage?.name,
          languageColour: rawRepo.primaryLanguage?.color,
          stars: rawRepo.stargazerCount,
          forks: rawRepo.forkCount,
          views: viewsResults[index].data.count,
          viewers: viewsResults[index].data.uniques,
          clones: clonesResults[index].data.count,
          cloners: clonesResults[index].data.uniques
        })
      })
    }

    await displayV3RateLimitData(axiosInstance, 'after')

    return {
      success: {
        user,
        repos
      }
    }
  } catch (e: unknown) {
    const errorMessage = getErrorMessage(e)
    log.error('[getReposImpl]', errorMessage)
    return { error: true, errorMessage }
  }
}
