import axios from 'axios'
import express from 'express'
import log from 'loglevel'
import * as C from './constants'

const ONE_YEAR_AS_MILLISECONDS = 1000 * 60 * 60 * 24 * 365

export const configureOAuthRouter = (clientId: string, clientSecret: string) => {

  const oauthCallback = async (req: express.Request, res: express.Response) => {
    try {
      log.info('[GET /oauth-callback]', 'req.query:', req.query)

      const url = 'https://github.com/login/oauth/access_token'

      const data = {
        client_id: clientId,
        client_secret: clientSecret,
        code: req.query.code
      }

      const config = {
        headers: {
          accept: 'application/json'
        }
      }

      const response = await axios.post(url, data, config)
      log.info('[GET /oauth-callback]', `received response from POST ${url}`)
      log.debug('[GET /oauth-callback]', 'received:', response.data)
      const token = response.data.access_token
      res.cookie(C.TOKEN_COOKIE_NAME, token, { maxAge: ONE_YEAR_AS_MILLISECONDS })
      res.redirect(C.HOME_VIEW)
    } catch (e: unknown) {
      if (e instanceof Error) {
        const error = e as Error
        log.error('[GET /oauth-callback]', 'ERROR:', error.message)
      } else {
        log.error('[GET /oauth-callback]', 'ERROR:', e)
      }
    }
  }

  const oauthRouter = express.Router()
  oauthRouter.get('/oauth-callback', oauthCallback)

  return oauthRouter
}
