import express, {Application} from 'express'
import cors from 'cors'
// import helmet from 'helmet'
// import bodyParser from 'body-parser'

import routes from '../routes'
// import connectDb from './connectDb'
// import {httpLoggerMiddleware as httpLogger} from './logger'

export default async (): Promise<Application> => {
  const app = express()
  app.use(cors())
  // app.use(httpLogger)

  // app.use(helmet())
  // app.use(bodyParser.json())

  // await connectDb()

  app.use('/', routes)

  return app
}
