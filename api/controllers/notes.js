const notesRouter = require('express').Router()
const userExtractor = require('../middlewares/userExtractor')
const User = require('../models/User')
const Note = require('../models/Note')

// Get all notes
notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1
  })
  res.json(notes)
})

// Get just one note
notesRouter.get('/:id', (req, res, next) => {
  const { id } = req.params

  Note.findById(id)
    .then(note => {
      return note ? res.json(note) : res.status(404).end()
    })
    .catch(err => {
      next(err)
    })
})

// Update a note
notesRouter.put('/:id', userExtractor, (req, res, next) => {
  const { id } = req.params
  const note = req.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => res.json(result))
    .catch(err => next(err))
})

// Delete just one note
notesRouter.delete('/:id', userExtractor, async (req, res, next) => {
  const { id } = req.params
  try {
    await Note.findByIdAndDelete(id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

// Save a note
notesRouter.post('/', userExtractor, async (req, res, next) => {
  const { content, important = false } = req.body
  const { userId } = req
  const user = await User.findById(userId)

  if (!content) {
    return res
      .status(400)
      .json({ error: 'note.content is missing' })
  }
  const newNote = new Note({
    content,
    date: new Date().toISOString(),
    important,
    user: userId
  })

  try {
    const savedNote = await newNote.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()
    res.status(201).json(savedNote)
  } catch (err) {
    next(err)
  }
})

module.exports = notesRouter
