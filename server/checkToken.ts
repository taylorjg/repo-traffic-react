import axios from 'axios'
import log from 'loglevel'
import { getErrorMessage } from './errorUtils'

// https://docs.github.com/rest/reference/apps#check-a-token
export const checkToken = async (clientId: string, clientSecret: string, token: string) => {
  try {
    if (!token) return undefined
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
    log.info('[checkToken]', 'token ok', 'login:', response.data.user.login)
    return response.data
  } catch (e: unknown) {
    log.error('[checkToken]', getErrorMessage(e))
    return undefined
  }
}
