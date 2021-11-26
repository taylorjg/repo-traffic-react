import { parseLinkHeader } from '../server/apiImpl'

describe('apiImpl unit tests', () => {
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
