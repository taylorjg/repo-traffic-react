import 'dotenv/config'
import history from 'connect-history-api-fallback'
import cookieParser from 'cookie-parser'
import { encryptCookieNodeMiddleware } from 'encrypt-cookie'
import express from 'express'
import log from 'loglevel'
import path from 'path'
import { configureApiRouter } from './apiRouter'
import { configureOAuthRouter } from './oauthRouter'
import { authenticateMiddleware } from './authenticateMiddleware'

const BUILD_FOLDER = path.resolve(__dirname, '..', 'build')

const level = process.env.LOG_LEVEL || 'info'
log.setLevel(level as log.LogLevelDesc)

const clientId = process.env.GITHUB_CLIENT_ID
const clientSecret = process.env.GITHUB_CLIENT_SECRET
const encryptCookiePassword = process.env.ENCRYPT_COOKIE_PASSWORD

if (!clientId) {
  process.stderr.write('GITHUB_CLIENT_ID must be defined!\n')
  process.exit(1)
}

if (!clientSecret) {
  process.stderr.write('GITHUB_CLIENT_SECRET must be defined!\n')
  process.exit(1)
}

if (!encryptCookiePassword) {
  process.stderr.write('ENCRYPT_COOKIE_PASSWORD must be defined!\n')
  process.exit(1)
}

const repoLimitString = process.env.REPO_LIMIT
const repoLimitNumber = Number(repoLimitString)
const repoLimit = Number.isInteger(repoLimitNumber) ? repoLimitNumber : 0

const apiRouter = configureApiRouter(clientId, clientSecret, repoLimit)
const oauthRouter = configureOAuthRouter(clientId, clientSecret)

const pathsRequiringAuthentication = ['/', '/index.html']

const app = express()
app.use(cookieParser())
app.use(encryptCookieNodeMiddleware(encryptCookiePassword))
app.use(oauthRouter)
app.use('/api', apiRouter)
app.use(history())
app.use(authenticateMiddleware(clientId, clientSecret, pathsRequiringAuthentication), express.static(BUILD_FOLDER))

const port = process.env.PORT || 5000
app.listen(port, () => log.info(`Listening on port ${port}`))
