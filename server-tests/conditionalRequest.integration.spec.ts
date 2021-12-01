import 'dotenv/config'
import axios from 'axios'

const { GITHUB_TOKEN_VALID } = process.env

describe('conditional request tests', () => {
  it('experiment', async () => {
    const axiosInstance = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${GITHUB_TOKEN_VALID}`
      }
    })

    const url = '/repos/taylorjg/repo-traffic-react/traffic/views'

    const response1 = await axiosInstance.get(url)
    expect(response1.status).toEqual(200)

    const config = {
      validateStatus: (status: number) => (status >= 200 && status < 300) || status === 304,
      headers: {
        'if-none-match': response1.headers.etag
      }
    }
    const response2 = await axiosInstance.get(url, config)
    expect(response2.status).toEqual(304)
    expect(response2.headers.etag).toEqual(response1.headers.etag)
    expect(response2.headers['x-ratelimit-used']).toEqual(response1.headers['x-ratelimit-used'])
    expect(response2.headers['x-ratelimit-remaining']).toEqual(response1.headers['x-ratelimit-remaining'])
  })
})
