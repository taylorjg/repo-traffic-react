import express from 'express'
import axios from 'axios'

export const configureOAuthRouter = (clientId: string, clientSecret: string) => {

  const oauthCallback = async (req: express.Request, res: express.Response) => {
    try {
      console.log('[GET /oauth-callback]', 'req.query:', req.query)

      const body = {
        client_id: clientId,
        client_secret: clientSecret,
        code: req.query.code
      }

      const opts = {
        headers: {
          accept: 'application/json'
        }
      }

      const { data } = await axios.post(`https://github.com/login/oauth/access_token`, body, opts)
      console.log('[POST https://github.com/login/oauth/access_token response]', 'data:', data)
      const token = data.access_token
      res.cookie('github-token', token, { maxAge: 1000 * 60 * 60 * 24 * 365 })
      res.redirect('/')
    } catch (e: unknown) {
      if (e instanceof Error) {
        const error = e as Error
        console.log('[GET /oauth-callback]', 'ERROR:', error.message)
      } else {
        console.log('[GET /oauth-callback]', 'ERROR:', e)
      }
    }
  }

  const oauthRouter = express.Router()
  oauthRouter.get('/oauth-callback', oauthCallback)

  return oauthRouter
}
