import express from 'express'
import { getReposImpl } from './apiImpl'

export const configureApiRouter = (token: string, repoLimit: number) => {

  const getRepos = async (_req: express.Request, res: express.Response) => {
    console.log('[getRepos]', 'token:', token, 'repoLimit:', repoLimit)
    const results = await getReposImpl(token, repoLimit)
    res.send(results)
  }

  const apiRouter = express.Router()
  apiRouter.get('/repos', getRepos)

  return apiRouter
}
