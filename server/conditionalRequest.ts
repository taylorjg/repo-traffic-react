import { AxiosInstance } from 'axios'
import log from 'loglevel'

type CacheKey = string
type CacheValue = { etag: string, data: any }

const cache = new Map<CacheKey, CacheValue>()

// https://docs.github.com/en/rest/overview/resources-in-the-rest-api#conditional-requests
export const conditionalRequest = async (axiosInstance: AxiosInstance, url: string) => {
  const cacheValue = cache.get(url)
  if (cacheValue) {
    const config = {
      validateStatus: (status: number) => (status >= 200 && status < 300) || status === 304,
      headers: {
        'if-none-match': cacheValue.etag
      }
    }
    const response = await axiosInstance.get(url, config)
    if (response.status === 304) {
      return { data: cacheValue.data, fromCache: true }
    } else {
      log.info('[conditionalRequest]', 'data has changed for url:', url)
      cache.set(url, { etag: response.headers.etag, data: response.data })
      return { data: response.data, fromCache: false }
    }
  } else {
    const response = await axiosInstance.get(url)
    cache.set(url, { etag: response.headers.etag, data: response.data })
    return { data: response.data, fromCache: false }
  }
}
