import 'dotenv/config'
import axios from 'axios'
import { getItemsGen, getReposImpl } from '../server/apiImpl'

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_TOKEN_VALID,
  GITHUB_TOKEN_REVOKED
} = process.env

describe('apiImpl integration tests', () => {

  describe('getItemsGen', () => {

    const url = 'https://api.github.com/users/taylorjg/repos'

    describe('when token is valid', () => {

      const axiosInstance = axios.create({
        baseURL: 'https://api.github.com',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${GITHUB_TOKEN_VALID}`
        }
      })

      it('when limit is specified', async () => {
        const asyncItemsIter = getItemsGen(axiosInstance, url, 100, 10)
        const items = []
        for await (const item of asyncItemsIter) {
          items.push(item)
        }
        expect(items).toHaveLength(10)
      })

      it('when no limit is specified', async () => {
        const asyncItemsIter = getItemsGen(axiosInstance, url, 100)
        const items = []
        for await (const item of asyncItemsIter) {
          items.push(item)
        }
        expect(items.length).toBeGreaterThan(200)
      }, 20000)
    })

    describe('when token is revoked', () => {

      const axiosInstance = axios.create({
        baseURL: 'https://api.github.com',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${GITHUB_TOKEN_REVOKED}`
        }
      })

      it('throws when trying to access the first item', async () => {
        const asyncItemsIter = getItemsGen(axiosInstance, url, 100, 10)
        await expect(asyncItemsIter.next()).rejects.toThrow('Request failed with status code 401')
      })
    })
  })

  describe('getReposImpl', () => {
    it('when limit is specified', async () => {
      const outcome = await getReposImpl(
        GITHUB_CLIENT_ID!,
        GITHUB_CLIENT_SECRET!,
        GITHUB_TOKEN_VALID!,
        10)
      expect(outcome.success).toHaveLength(10)
    })
  })
})
