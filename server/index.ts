import 'dotenv/config'
import express from 'express'
import { configureApi } from './api'

const username = process.env.GITHUB_USERNAME
const token = process.env.GITHUB_TOKEN

if (!username || !token) {
  process.stderr.write('GITHUB_USERNAME and GITHUB_TOKEN both need to be defined!\n')
  process.exit(1)
}

const apiRouter = configureApi(username, token)

const app = express()
app.use('/api', apiRouter)

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on port ${port}`))
