import axios from 'axios'
import express from 'express'

// https://docs.github.com/rest/reference/apps#check-a-token
const checkToken = async (clientId: string, clientSecret: string, token: any) => {
  try {
    if (typeof token !== 'string') return false
    const url = `https://api.github.com/applications/${clientId}/token`
    const data = { access_token: token }
    const config = {
      auth: {
        username: clientId,
        password: clientSecret
      },
      headers:
      {
        'Accept': 'application/vnd.github.v3+json',
      }
    }
    const response = await axios.post(url, data, config)
    console.log('[checkToken]', 'login:', response.data.user.login)
    return true
  } catch (e: unknown) {
    if (e instanceof Error) {
      const error = e as Error
      console.log('[checkToken]', 'ERROR:', error.message)
    } else {
      console.log('[checkToken]', 'ERROR:', e)
    }
    return false
  }
}

export const authenticateMiddleware = (clientId: string, clientSecret: string) => {

  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log('[authenticateMiddleware]', 'req.url:', req.url, 'req.originalUrl:', req.originalUrl)
    if (['/', '/index.html'].includes(req.originalUrl)) {
      const token = req.cookies['github-token']
      console.log('[authenticateMiddleware]', '"github-token" cookie:', token)
      const ok = await checkToken(clientId, clientSecret, token)
      if (!ok) {
        res.redirect('/authorize')
        return
      }
    }
    next()
  }
}
