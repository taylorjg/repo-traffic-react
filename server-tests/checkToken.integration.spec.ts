import 'dotenv/config'
import { checkToken } from '../server/checkToken'
import log from 'loglevel'

log.setLevel('silent')

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_TOKEN_VALID,
  GITHUB_TOKEN_REVOKED
} = process.env

describe('checkToken integration tests', () => {

  it('when token is valid', async () => {
    const checkTokenData = await checkToken(GITHUB_CLIENT_ID!, GITHUB_CLIENT_SECRET!, GITHUB_TOKEN_VALID!)
    expect(checkTokenData).toBeDefined()
  })

  it('when token is revoked', async () => {
    const checkTokenData = await checkToken(GITHUB_CLIENT_ID!, GITHUB_CLIENT_SECRET!, GITHUB_TOKEN_REVOKED!)
    expect(checkTokenData).toBeUndefined()
  })

  it('when token is bogus', async () => {
    const checkTokenData = await checkToken(GITHUB_CLIENT_ID!, GITHUB_CLIENT_SECRET!, 'bogus')
    expect(checkTokenData).toBeUndefined()
  })
})
