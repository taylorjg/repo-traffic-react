import express from 'express'
import { getReposImpl } from './apiImpl'

export const configureApiRouter = (clientId: string, clientSecret: string, repoLimit: number) => {

  const getRepos = async (req: express.Request, res: express.Response) => {
    const token = req.cookies['github-token'] as string
    console.log('[GET /api/repos]', 'clientId:', clientId, 'token:', token, 'repoLimit:', repoLimit)
    const outcome = await getReposImpl(clientId, clientSecret, token, repoLimit)
    // TODO: introduce a type to model outcome
    if (outcome.success) {
      res.send(outcome.success)
    } else {
      if (outcome.badToken) {
        res.status(401).end()
      } else {
        res.status(500).end()
      }
    }
  }

  const getClientId = (_req: express.Request, res: express.Response) => {
    console.log('[GET /api/clientId]', 'clientId:', clientId)
    res.json({ clientId })
  }

  const apiRouter = express.Router()
  apiRouter.get('/repos', getRepos)
  apiRouter.get('/clientId', getClientId)

  return apiRouter
}
