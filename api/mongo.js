const mongoose = require('mongoose')
const process = require('process')
const { MONGODB_URI, MONGODB_URI_TEST, NODE_ENV } = process.env

const connectionString = NODE_ENV === 'test' ? MONGODB_URI_TEST : MONGODB_URI

const connectionOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}

mongoose
  .connect(connectionString, connectionOptions)
  .then(() => console.log('DB is connected'))
  .catch(err => console.error(err))

process.on('uncaughtException', error => {
  console.error(error)
  mongoose.disconnect()
})
