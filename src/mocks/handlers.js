import { rest } from 'msw'

export const handlers = [
  rest.get('/api/repos', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          "id": 123,
          "name": "Repo 1 Name",
          "description": "Repo 1 Description",
          "createdAt": "2017-09-07T17:15:54Z",
          "updatedAt": "2018-12-05T21:08:39Z",
          "htmlUrl": "https://github.com/taylorjg/repo1",
          "language": "TypeScript",
          "starsCount": 10,
          "forksCount": 20,
          "viewsCount": 30,
          "viewsUniques": 5,
          "clonesCount": 5,
          "clonesUniques": 2
        }])
    )
  })
]
