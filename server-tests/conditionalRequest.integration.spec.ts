import 'dotenv/config'
import axios from 'axios'
import { conditionalRequest } from '../server/conditionalRequest'
import * as C from '../server/constants'

const { GITHUB_TOKEN_VALID } = process.env

describe('conditionalRequest integration tests', () => {

  const axiosInstance = axios.create({
    baseURL: C.GITHUB_API_URL_V3,
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${GITHUB_TOKEN_VALID}`
    }
  })

  it('experiment', async () => {
    const url = '/repos/taylorjg/repo-traffic-react/traffic/views'
    const result1 = await conditionalRequest(axiosInstance, url)
    const result2 = await conditionalRequest(axiosInstance, url)
    expect(result2.data).toEqual(result1.data)
    expect(result1.fromCache).toBeFalsy()
    expect(result2.fromCache).toBeTruthy()
  })
})
