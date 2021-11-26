import 'dotenv/config'
import axios from 'axios'
import express from 'express'
import path from 'path'
import { configureApiRouter } from './apiRouter'

const BUILD_FOLDER = path.resolve(__dirname, '..', 'build')

const token = process.env.GITHUB_TOKEN
const clientId = process.env.GITHUB_CLIENT_ID
const clientSecret = process.env.GITHUB_CLIENT_SECRET
const repoLimitString = process.env.REPO_LIMIT
const repoLimitNumber = Number(repoLimitString)

if (!token) {
  process.stderr.write('GITHUB_TOKEN must be defined!\n')
  process.exit(1)
}

const apiRouter = configureApiRouter(token, Number.isInteger(repoLimitNumber) ? repoLimitNumber : 0)

const app = express()
app.use(express.static(BUILD_FOLDER))
app.use('/api', apiRouter)

app.get('/oauth-callback', (req, res) => {
  console.log('GET /oauth-callback', req.query)
  const body = {
    client_id: clientId,
    client_secret: clientSecret,
    code: req.query.code
  }
  const opts = {
    headers: {
      accept: 'application/json'
    }
  }
  axios.post(`https://github.com/login/oauth/access_token`, body, opts)
    .then(res => {
      console.log('[POST https://github.com/login/oauth/access_token response]', 'res.data:', res.data)
      return res.data.access_token
    })
    .then(token => {
      console.log('My token:', token)
      res.cookie('github-token', token, { maxAge: 1000 * 60 * 60 * 24 * 365 })
      res.json({ ok: 1 })
    })
    .catch(err => res.status(500).json({ message: err.message }))
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on port ${port}`))
