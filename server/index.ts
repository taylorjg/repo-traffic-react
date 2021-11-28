import 'dotenv/config'
import history from 'connect-history-api-fallback'
import cookieParser from 'cookie-parser'
import express from 'express'
import path from 'path'
import { configureApiRouter } from './apiRouter'
import { configureOAuthRouter } from './oauthRouter'
import { authenticateMiddleware } from './authenticateMiddleware'

const BUILD_FOLDER = path.resolve(__dirname, '..', 'build')

const clientId = process.env.GITHUB_CLIENT_ID
const clientSecret = process.env.GITHUB_CLIENT_SECRET
const repoLimitString = process.env.REPO_LIMIT
const repoLimitNumber = Number(repoLimitString)
const repoLimit = Number.isInteger(repoLimitNumber) ? repoLimitNumber : 0

if (!clientId) {
  process.stderr.write('GITHUB_CLIENT_ID must be defined!\n')
  process.exit(1)
}

if (!clientSecret) {
  process.stderr.write('GITHUB_CLIENT_SECRET must be defined!\n')
  process.exit(1)
}

const apiRouter = configureApiRouter(clientId, clientSecret, repoLimit)
const oauthRouter = configureOAuthRouter(clientId, clientSecret)

const app = express()
app.use(cookieParser())
app.use(oauthRouter)
app.use('/api', apiRouter)
app.use(history())
app.use(authenticateMiddleware(clientId, clientSecret), express.static(BUILD_FOLDER))

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on port ${port}`))
