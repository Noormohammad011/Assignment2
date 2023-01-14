import express from 'express'
import chalk from 'chalk'
import cors from 'cors'
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import helmet from 'helmet'
import hpp from 'hpp'
import * as dotenv from 'dotenv'
import connectDB from './config/db.js'
import fileUpload from 'express-fileupload'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

//import router
import tourRoutes from './routes/tourRoutes.js'

//import middlewares
import morgan from 'morgan'
import path from 'path'

//dotenv config
dotenv.config()
//express configuration
const app = express()

//conncet to database
connectDB()
//morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'))
}

// For parsing application/json
app.use(express.json())

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))
// Enable cors
app.use(cors())

//file upload
app.use(fileUpload())

//sanitize data
app.use(mongoSanitize())

//set security headers
app.use(helmet())

//prevent xss attacks
app.use(xss())

//prevent http param pollution
app.use(hpp())



//set static folder
app.use(express.static(path.join(path.dirname(''), 'public')))

app.get('/api-docs', (req, res) => { 
  res.sendFile(path.join(path.dirname(''), 'public', 'index.html'))
})
app.get('/postman-link', (req, res) => {
  res.send(
    "<h1>Postman</h1><a href='https://documenter.getpostman.com/view/12490462/2s8ZDSckco#86859d49-ca10-4a81-9280-5eefa6e6a71d'>Clik Here</a>"
  )
 })
//route mount
app.use('/api/v1/tours', tourRoutes)


//middleware for error handling
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    chalk.cyan.underline(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
  )
)
