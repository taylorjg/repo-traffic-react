import axios, { AxiosInstance } from 'axios'
import log from 'loglevel'
import { checkToken } from './checkToken'
import { conditionalRequest } from './conditionalRequest'
import { getErrorMessage } from './errorUtils'

const MAX_REPOS_PER_PAGE = 100
const MAX_PARALLEL_TRAFFIC_CALLS = 25

// https://docs.github.com/en/rest/overview/resources-in-the-rest-api#pagination
export const parseLinkHeader = (linkHeader: string) => {
  if (!linkHeader) {
    return []
  }
  return linkHeader
    .split(',')
    .map(link => link.split(';').map(s => s.trim()))
    .map(([hrefPart, relPart]) => {
      const hrefMatch = /^<([^>]+)>$/.exec(hrefPart ?? '')
      const relMatch = /^rel="([^"]+)"$/.exec(relPart ?? '')
      const href = hrefMatch?.[1] ?? ''
      const rel = relMatch?.[1] ?? ''
      return { href, rel }
    })
}

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

export async function* getItemsGen(
  axiosInstance: AxiosInstance,
  initialUrl: string,
  options: {
    pageSize?: number,
    maxItems?: number
  } = {}
): AsyncGenerator<any> {

  async function* helper(url: string, itemCountSoFar: number): AsyncGenerator<any> {

    log.info('[getItemsGen helper]', 'url:', url)

    let maybePerPageParam = {}
    if (options.pageSize) {
      if (options.maxItems) {
        const remainingItems = options.maxItems - itemCountSoFar
        maybePerPageParam = { per_page: Math.min(options.pageSize, remainingItems) }
      } else {
        maybePerPageParam = { per_page: options.pageSize }
      }
    }

    const config = {
      params: {
        ...maybePerPageParam
      }
    }

    const response = await axiosInstance.get(url, config)
    const items = response.data
    yield* items

    const linkHeader = response.headers['link']
    const links = parseLinkHeader(linkHeader)
    const nextLink = links.find(({ rel }) => rel === 'next')
    if (nextLink) {
      const newItemCountSoFar = itemCountSoFar + items.length
      if (options.maxItems && newItemCountSoFar >= options.maxItems) {
        return
      }
      yield* helper(nextLink.href, newItemCountSoFar)
    }
  }

  yield* helper(initialUrl, 0)
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

    await displayRateLimitData(axiosInstance, 'before')

    const asyncReposIter = getItemsGen(axiosInstance, reposUrl, {
      pageSize: MAX_REPOS_PER_PAGE,
      maxItems: repoLimit
    })

    const results: any[] = []

    for await (const reposChunk of asyncSplitEvery(asyncReposIter, MAX_PARALLEL_TRAFFIC_CALLS)) {
      log.info('[getReposImpl]', 'reposChunk.length:', reposChunk.length)
      const viewsPromises = reposChunk.map(repo => conditionalRequest(axiosInstance, `/repos/${repo.owner.login}/${repo.name}/traffic/views`))
      const clonesPromises = reposChunk.map(repo => conditionalRequest(axiosInstance, `/repos/${repo.owner.login}/${repo.name}/traffic/clones`))
      const responses = await Promise.all([...viewsPromises, ...clonesPromises])
      const viewsResults = responses.slice(0, reposChunk.length)
      const clonesResults = responses.slice(reposChunk.length)
      reposChunk.forEach((repo: any, index: number) => {
        results.push({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          createdAt: repo.created_at,
          updatedAt: repo.updated_at,
          htmlUrl: repo.html_url,
          language: repo.language,
          starsCount: repo.stargazers_count,
          forksCount: repo.forks_count,
          viewsCount: viewsResults[index].data.count,
          viewsUniques: viewsResults[index].data.uniques,
          clonesCount: clonesResults[index].data.count,
          clonesUniques: clonesResults[index].data.uniques
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
