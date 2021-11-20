import express from 'express'

export const configureApi = (token: string) => {

  const getRepos = async (_req: express.Request, res: express.Response) => {
    res.send(token)
  }

  const apiRouter = express.Router()
  apiRouter.get('/repos', getRepos)

  return apiRouter
}
