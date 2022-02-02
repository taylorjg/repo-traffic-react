import { render, screen, waitFor } from '@testing-library/react'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import App from './App'

// Mock Google Analytics
window.gtag = jest.fn()

const handlers = [
  rest.get('/api/repos', (_req, res, ctx) => {
    return res(
      ctx.json([
        {
          "id": 1,
          "name": "Repo 1 Name",
          "description": "Repo 1 Description",
          "createdAt": "2021-01-01T01:00:00Z",
          "updatedAt": "2021-02-02T02:00:00Z",
          "htmlUrl": "https://github.com/taylorjg/repo1",
          "language": "TypeScript",
          "starsCount": 1,
          "forksCount": 2,
          "viewsCount": 3,
          "viewsUniques": 4,
          "clonesCount": 5,
          "clonesUniques": 6
        },
        {
          "id": 2,
          "name": "Repo 2 Name",
          "description": "Repo 2 Description",
          "createdAt": "2021-03-03T03:00:00Z",
          "updatedAt": "2021-04-04T04:00:00Z",
          "htmlUrl": "https://github.com/taylorjg/repo2",
          "language": "TypeScript",
          "starsCount": 7,
          "forksCount": 8,
          "viewsCount": 9,
          "viewsUniques": 10,
          "clonesCount": 11,
          "clonesUniques": 12
        }
      ]
      )
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
