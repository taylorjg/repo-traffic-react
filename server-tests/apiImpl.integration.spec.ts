import 'dotenv/config'
import { getReposImpl } from '../server/apiImpl'

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_TOKEN_VALID
} = process.env

describe('apiImpl integration tests', () => {
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
