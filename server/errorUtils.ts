import axios from 'axios'

export const getErrorMessage = (e: unknown) => {

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
