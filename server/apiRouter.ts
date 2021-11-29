import express from 'express'
import log from 'loglevel'
import { getReposImpl } from './apiImpl'
import * as C from './constants'

export const configureApiRouter = (clientId: string, clientSecret: string, repoLimit: number) => {

  const getRepos = async (req: express.Request, res: express.Response) => {
    const token = req.cookies[C.TOKEN_COOKIE_NAME] as string
    log.info('[GET /api/repos]', 'clientId:', clientId, 'repoLimit:', repoLimit)
    log.debug('[GET /api/repos]', 'token:', token)
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
    log.info('[GET /api/clientId]', 'clientId:', clientId)
    res.json({ clientId })
  }

  const apiRouter = express.Router()
  apiRouter.get('/repos', getRepos)
  apiRouter.get('/clientId', getClientId)

  return apiRouter
}
