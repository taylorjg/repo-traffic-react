import express from 'express'
import log from 'loglevel'
import { checkToken } from './checkToken'
import * as C from './constants'

export const authenticateMiddleware = (clientId: string, clientSecret: string, paths: string[]) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    log.info('[authenticateMiddleware]', 'req.url:', req.url, 'req.originalUrl:', req.originalUrl)
    if (paths.includes(req.originalUrl)) {
      const token = req.cookies[C.TOKEN_COOKIE_NAME]
      log.debug('[authenticateMiddleware]', 'token:', token)
      const checkTokenData = await checkToken(clientId, clientSecret, token)
      if (!checkTokenData) {
        res.redirect(C.AUTHORIZE_VIEW)
        return
      }
    }
    next()
  }
}
