import { render, screen, waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import App from './App'

// Mock Google Analytics
window.gtag = jest.fn()

const handlers = [
  rest.get('/api/repos', (_req, res, ctx) => {
    return res(
      ctx.json({
        user: {
          login: "some-login-name",
          followers: {
            totalCount: 0
          }
        },
        repos: [
          {
            id: 1,
            name: "Repo 1 Name",
            description: "Repo 1 Description",
            createdAt: "2021-01-01T01:00:00Z",
            updatedAt: "2021-02-02T02:00:00Z",
            htmlUrl: "https://github.com/taylorjg/repo1",
            homepageUrl: "https://github.com/taylorjg/website1",
            language: "TypeScript",
            stars: 1,
            forks: 2,
            views: 3,
            viewers: 4,
            clones: 5,
            cloners: 6
          },
          {
            id: 2,
            name: "Repo 2 Name",
            description: "Repo 2 Description",
            createdAt: "2021-03-03T03:00:00Z",
            updatedAt: "2021-04-04T04:00:00Z",
            htmlUrl: "https://github.com/taylorjg/repo2",
            homepageUrl: "https://github.com/taylorjg/website2",
            language: "TypeScript",
            stars: 7,
            forks: 8,
            views: 9,
            viewers: 10,
            clones: 11,
            cloners: 12
          }
        ]
      })
    )
  })
]

export const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('App renders with correct repo names', async () => {
  render(<App />)
  await waitFor(() => {
    expect(screen.getByText('Repo 1 Name')).toBeInTheDocument()
    expect(screen.getByText('Repo 2 Name')).toBeInTheDocument()
  })
})
