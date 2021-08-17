const express = require('express')
const cors = require('cors')
const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const notFound = require('./middlewares/404')
const handleErrors = require('./middlewares/handleErrors')

require('dotenv').config()
require('./mongo')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('../app/build'))

Sentry.init({
  dsn: 'https://20863cbc95384d079ef120734586bb60@o948287.ingest.sentry.io/5897488',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app })
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

// Login routes
app.use('/api/login', loginRouter)

// Notes routes
app.use('/api/notes', notesRouter)

// Users routes
app.use('/api/users', usersRouter)

// ONLY FOR TESTING (DON'T TOUCH)
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

// 404 Error
app.use(notFound)

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())

// Errors
app.use(handleErrors)

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () => {
  console.log(`Server running in port: ${PORT}`)
})

module.exports = {
  app,
  server
}
