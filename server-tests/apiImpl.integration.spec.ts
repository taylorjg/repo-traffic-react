import 'dotenv/config'
import axios from 'axios'
import { getUserData } from '../server/apiImpl'

const token = process.env.GITHUB_TOKEN

describe('apiImpl integration tests', () => {
  it('getUserData', async () => {
    const axiosInstance = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${token}`
      }
    })
    const userData = await getUserData(axiosInstance)
    expect(userData.login).toBe('taylorjg')
    expect(userData.repos_url).toBe('https://api.github.com/users/taylorjg/repos')
  })
})
