import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import express from 'express'

const getErrorMessage = (error: Error) => {
  const response = (error as any).response as AxiosResponse
  if (response) {
    const status = response.status
    const statusText = response.statusText
    if (response.data && response.data.message) {
      return `status: ${status}; statusText: ${statusText}; message: ${response.data.message}`
    }
    else {
      return `status: ${status}; statusText: ${statusText}; message: ${error.message}`
    }
  } else {
    return `message: ${error.message}`
  }
}

const parseLinkHeader = (response: AxiosResponse) => {
  const linkHeader = response.headers['link']
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

async function* asyncSplitEvery<T>(xs: AsyncGenerator<T>, n: number): AsyncGenerator<T[]> {
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

async function* getPagesGen(url: string, config: AxiosRequestConfig): AsyncGenerator<any> {
  console.log('[getPagesGen]', 'url:', url)
  try {
    const response = await axios.get(url, config)
    const repos = response.data
    yield* repos
    const links = parseLinkHeader(response)
    const nextLink = links.find(({ rel }) => rel === 'next')
    if (nextLink) {
      yield* getPagesGen(nextLink.href, config)
    }
  } catch (error) {
    console.log(getErrorMessage(error as Error))
  }
}

async function* getPageGen(url: string, config: AxiosRequestConfig): AsyncGenerator<any> {
  console.log('[getPageGen]', 'url:', url)
  try {
    const response = await axios.get(url, config)
    const repos = response.data
    yield* repos
  } catch (error) {
    console.log(getErrorMessage(error as Error))
  }
}

const displayRateLimitData = async () => {
  const { data } = await axios.get('/rate_limit')
  console.log(`rate limit: ${data.resources.core.limit}`)
  console.log(`rate remaining: ${data.resources.core.remaining}`)
  console.log(`rate reset: ${new Date(data.resources.core.reset * 1000)}`)
}

export const configureApi = (username: string, token: string, repoLimit: number) => {

  axios.defaults.baseURL = 'https://api.github.com'
  axios.defaults.headers.common['Accept'] = 'application/vnd.github.v3+json'
  axios.defaults.headers.common['Authorization'] = `token ${token}`

  const getRepos = async (_req: express.Request, res: express.Response) => {
    displayRateLimitData()
    const url = `/users/${username}/repos`
    const config = {
      params: {
        per_page: repoLimit > 0 ? repoLimit : 100
      }
    }
    const asyncIter = repoLimit > 0 ? getPageGen(url, config) : getPagesGen(url, config)
    const CHUNK_SIZE = 100
    const results: any[] = []
    for await (const reposChunk of asyncSplitEvery(asyncIter, CHUNK_SIZE)) {
      console.log('[getRepos]', 'reposChunk.length:', reposChunk.length)
      const viewsPromises = reposChunk.map(repo => axios.get(`/repos/${repo.owner.login}/${repo.name}/traffic/views`))
      const clonesPromises = reposChunk.map(repo => axios.get(`/repos/${repo.owner.login}/${repo.name}/traffic/clones`))
      const responses = await Promise.all([...viewsPromises, ...clonesPromises])
      const viewsResponses = responses.slice(0, reposChunk.length)
      const clonesResponses = responses.slice(reposChunk.length)
      reposChunk.forEach((repo: any, index: number) => {
        results.push({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          created_at: repo.created_at,
          updated_at: repo.updated_at,
          html_url: repo.html_url,
          language: repo.language,
          starsCount: repo.stargazers_count,
          forksCount: repo.forks_count,
          viewsCount: viewsResponses[index].data.count,
          viewsUniques: viewsResponses[index].data.uniques,
          clonesCount: clonesResponses[index].data.count,
          clonesUniques: clonesResponses[index].data.uniques
        })
      })
    }
    res.send(results)
  }

  const apiRouter = express.Router()
  apiRouter.get('/repos', getRepos)

  return apiRouter
}
