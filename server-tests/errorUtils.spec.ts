import axios from 'axios'
import { getErrorMessage } from '../server/errorUtils'
import log from 'loglevel'

describe('errorUtils unit tests', () => {

  describe('getErrorMessage', () => {

    let savedLogErrorFn: (...msg: any[]) => void

    beforeEach(() => {
      savedLogErrorFn = log.error
      log.error = jest.fn()
    })

    afterEach(() => {
      log.error = savedLogErrorFn
    })

    it('string', () => {
      const e = 'My error message'
      const actual = getErrorMessage(e)
      expect(actual).toEqual('My error message')
    })

    it('Error', () => {
      const e = new Error('My error message')
      const actual = getErrorMessage(e)
      expect(actual).toEqual('My error message')
    })

    it('AxiosError', async () => {
      const causeAxiosError = async () => {
        try {
          await axios.get('bogus')
        } catch (e: unknown) {
          return e
        }
      }
      const e = await causeAxiosError()
      const actual = getErrorMessage(e)
      expect(actual).toEqual('Error: connect ECONNREFUSED 127.0.0.1:80')
    })
  })
})
