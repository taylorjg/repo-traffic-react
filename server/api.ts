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

async function* getPagesGen(url: string, config: AxiosRequestConfig): AsyncGenerator {
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
    const repos = []
    for await (const repo of getPagesGen(url, config)) {
      repos.push(repo)
    }
    res.send(repos)
  }

  const apiRouter = express.Router()
  apiRouter.get('/repos', getRepos)

  return apiRouter
}
