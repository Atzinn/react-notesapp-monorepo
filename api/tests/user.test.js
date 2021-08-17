const supertest = require('supertest')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const mongoose = require('mongoose')
const { app, server } = require('../index')
const { getUsers } = require('./helper')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('pswd', 10)
  const user = new User({
    username: 'atzinnroot',
    name: 'atzin pruebas',
    passwordHash
  })

  await user.save()
})

describe.only('creating a new user', () => {
  test.skip('works as expected creating a fresh username', async () => {
    const usersAtStart = await getUsers()
    const newUser = {
      username: 'elatt',
      name: 'atzinn',
      password: 'elatt11'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await getUsers()

    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usersnames = usersAtEnd.map(u => u.username)
    expect(usersnames).toContain(newUser.username)
  })

  test('creation fails with proper status code and message if username is alrady taken', async () => {
    const usersAtStart = await getUsers()

    const newUser = {
      username: 'atzinnroot',
      name: 'atzin pruebas2',
      password: 'asdasd'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(409)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error.errors.username.message).toContain('`username` to be unique')

    const usersAtEnd = await getUsers()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
