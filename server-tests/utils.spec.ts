import { splitEvery } from '../server/utils'

describe('utils unit tests', () => {

  describe('splitEvery', () => {

    it('typical usage', () => {
      const xs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      const actual = Array.from(splitEvery(xs, 4))
      const expected = [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9]
      ]
      expect(actual).toEqual(expected)
    })
  })
})
