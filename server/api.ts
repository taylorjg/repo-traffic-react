import axios from 'axios'
import express from 'express'

const parseLinkHeader = (response: express.Response) => {
  const linkHeader = response.getHeaders()['link']
  if (typeof linkHeader !== 'string' || !linkHeader) {
    return []
  }
  return linkHeader
    .split(',')
    .map(link => link.split(';').map(s => s.trim()))
    .map(([hrefPart, relPart]) => {
      const hrefMatch = /^<([^>]+)>$/.exec(hrefPart ?? '')
      const relMatch = /^rel="([^"]+)"$/.exec(relPart ?? '')
      if (!hrefMatch || !relMatch) return null
      const href = hrefMatch[1]
      const rel = relMatch[1]
      return { href, rel }
    })
    .filter(Boolean)
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
    const { data } = await axios.get(url, config)
    res.send(data)
  }

  const apiRouter = express.Router()
  apiRouter.get('/repos', getRepos)

  return apiRouter
}
