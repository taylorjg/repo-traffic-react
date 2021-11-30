import { asyncSplitEvery, parseLinkHeader } from '../server/apiImpl'

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

  it('parseLinkHeader', () => {
    const linkHeader = '<https://api.github.com/user/676165/repos?per_page=100&page=2>; rel="next", <https://api.github.com/user/676165/repos?per_page=100&page=3>; rel="last"'
    const links = parseLinkHeader(linkHeader)
    expect(links).toHaveLength(2)
    expect(links[0]).toEqual({
      href: 'https://api.github.com/user/676165/repos?per_page=100&page=2',
      rel: 'next'
    })
    expect(links[1]).toEqual({
      href: 'https://api.github.com/user/676165/repos?per_page=100&page=3',
      rel: 'last'
    })
  })
})
