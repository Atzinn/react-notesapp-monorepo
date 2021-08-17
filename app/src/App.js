import React, { useState, useEffect } from 'react'

import noteService from './services/notes'

import Note from './components/Note'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm.jsx'
import NoteForm from './components/NoteForm.jsx'


const App = () => {
  const [notes, setNotes] = useState([]) 
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  // const [username, setUsername] = useState('')
  // const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    setUser(null)
    noteService.setToken(user.token)
    window.localStorage.removeItem('loggedNoteAppUser')
  }

  const addNote = noteObject => {
    noteService
      .create(noteObject)
      .then(returnedNote => setNotes(notes.concat(returnedNote)))
  }

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
  
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)   
      })
  }

  const saveUserInState = usr => {
    window.localStorage.setItem('loggedNoteAppUser', JSON.stringify(usr))
    noteService.setToken(usr.token)
    setUser(usr)
  }

  const handleLoginError = err => setErrorMessage(err)

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={ errorMessage } />
      {
        user
          ? <NoteForm 
              addNote={ addNote }
              handleLogout={ handleLogout }
            />
          : <LoginForm 
              saveUserInState={ saveUserInState }
              handleLoginError={ handleLoginError }
            />
      }
      <br />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>      
      <ul>
        {notesToShow.map((note, i) => 
          <Note
            key={i}
            note={note} 
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>
         
    </div>
  )
}

export default App 