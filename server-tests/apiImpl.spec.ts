import { asyncSplitEvery } from '../server/apiImpl'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

describe('apiImpl unit tests', () => {

  it('asyncSplitEvery', async () => {

    async function* asyncIterGen(n: number) {
      for (let i = 0; i < n; i++) {
        yield i
        await delay(0)
      }
    }

    const xs = asyncIterGen(10)
    const chunks = []
    for await (const chunk of asyncSplitEvery(xs, 4)) {
      chunks.push(chunk)
    }

    expect(chunks).toHaveLength(3)
    expect(chunks[0]).toEqual([0, 1, 2, 3])
    expect(chunks[1]).toEqual([4, 5, 6, 7])
    expect(chunks[2]).toEqual([8, 9])
  })
})
