const supertest = require('supertest')
const { app } = require('../index')
const User = require('../models/User')

const api = supertest(app)

const initialNotes = [
  {
    content: 'Aprendiendo JS',
    important: true,
    date: new Date()
  },
  {
    content: 'Sigueme en Instaram [@elatt]',
    important: true,
    date: new Date()
  },
  {
    content: 'Mexico bronce en furbol',
    important: true,
    date: new Date()
  },
  {
    content: 'una nota mas',
    important: true,
    date: new Date()
  }
]

const getAllContentFromNotes = async () => {
  const response = await api.get('/api/notes')
  return {
    contents: response.body.map(note => note.content),
    response
  }
}

const getUsers = async () => {
  const usersDB = await User.find({})
  return usersDB.map(user => user.toJSON())
}

module.exports = {
  api,
  initialNotes,
  getAllContentFromNotes,
  getUsers
}
