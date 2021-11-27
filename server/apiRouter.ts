import express from 'express'
import { getReposImpl } from './apiImpl'

export const configureApiRouter = (clientId: string, clientSecret: string, token: string, repoLimit: number) => {

  const getRepos = async (_req: express.Request, res: express.Response) => {
    console.log('[GET /api/repos]', 'clientId:', clientId, 'token:', token, 'repoLimit:', repoLimit)
    const results = await getReposImpl(clientId, clientSecret, token, repoLimit)
    res.send(results)
  }

  const apiRouter = express.Router()
  apiRouter.get('/repos', getRepos)

  return apiRouter
}
