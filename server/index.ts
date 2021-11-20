import 'dotenv/config'
import express from 'express'
import { configureApi } from './api'

const apiRouter = configureApi(process.env.GITHUB_TOKEN ?? '')

const app = express()
app.use('/api', apiRouter)

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on port ${port}`))
