import axios from 'axios'
import log from 'loglevel'

export const getErrorMessage = (e: unknown) => {

  log.error('[getErrorMessage]', e)

  if (axios.isAxiosError(e) && e.response) {

    const status = e.response.status
    const statusText = e.response.statusText

    // https://docs.github.com/en/rest/overview/resources-in-the-rest-api#client-errors
    const message = e.response.data?.message ?? e.message

    return `status: ${status}; statusText: ${statusText}; message: ${message}`
  }

  if (e instanceof Error) {
    return e.message
  }

  return String(e)
}
