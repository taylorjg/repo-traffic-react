import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import express from 'express'

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

async function* splitEvery<T>(xs: AsyncGenerator<T>, n: number): AsyncGenerator<T[]> {
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
  const response = await axios.get(url, config)
  const repos = response.data
  yield* repos
  const links = parseLinkHeader(response)
  const nextLink = links.find(({ rel }) => rel === 'next')
  if (nextLink) {
    yield* getPagesGen(nextLink.href, config)
  }
}

export const configureApi = (username: string, token: string) => {

  axios.defaults.baseURL = 'https://api.github.com'
  axios.defaults.headers.common['Accept'] = 'application/vnd.github.v3+json'
  axios.defaults.headers.common['Authorization'] = `token ${token}`

  const getRepos = async (_req: express.Request, res: express.Response) => {
    const url = `/users/${username}/repos`
    const config = {
      params: {
        per_page: 100
      }
    }
    const asyncIter = getPagesGen(url, config)
    const CHUNK_SIZE = 50
    const results: any[] = []
    for await (const reposChunk of splitEvery(asyncIter, CHUNK_SIZE)) {
      console.log('[getRepos]', 'reposChunk.length:', reposChunk.length)
      const viewsPromises = reposChunk.map(repo => axios.get(`/repos/${repo.owner.login}/${repo.name}/traffic/views`))
      const clonesPromises = reposChunk.map(repo => axios.get(`/repos/${repo.owner.login}/${repo.name}/traffic/clones`))
      const fred = await Promise.all([...viewsPromises, ...clonesPromises])
      reposChunk.forEach((repo: any, index: number) => {
        results.push({
          repo: {
            name: repo.name,
            description: repo.description,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            created_at: repo.created_at,
            updated_at: repo.updated_at,
            html_url: repo.html_url,
            language: repo.language
          },
          views: fred[index].data,
          clones: fred[index + reposChunk.length].data
        })
      })
    }
    res.send(results)
  }

  const apiRouter = express.Router()
  apiRouter.get('/repos', getRepos)

  return apiRouter
}
