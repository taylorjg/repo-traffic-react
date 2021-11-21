import 'dotenv/config'
import express from 'express'
import path from 'path'
import { configureApi } from './api'

const BUILD_FOLDER = path.resolve(__dirname, '..', 'build')
console.log('BUILD_FOLDER:', BUILD_FOLDER)

const username = process.env.GITHUB_USERNAME
const token = process.env.GITHUB_TOKEN

if (!username || !token) {
  process.stderr.write('GITHUB_USERNAME and GITHUB_TOKEN must be defined!\n')
  process.exit(1)
}

const apiRouter = configureApi(username, token)

const app = express()
app.use(express.static(BUILD_FOLDER))
app.use('/api', apiRouter)

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on port ${port}`))
