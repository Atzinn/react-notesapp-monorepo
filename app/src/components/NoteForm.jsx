import React, { useState, useRef } from 'react'
import Toggleable from './Toggleable.jsx'

export default function NoteForm({ addNote, handleLogout }) {
  const [newNote, setNewNote] = useState('')
  const toggleableRef = useRef()
  
  const handleChange = ({ target }) => {
    setNewNote(target.value)
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: false,
    }

    addNote(noteObject)
    setNewNote('')
    toggleableRef.current.toggleVisibility()
  }


  return (
    <Toggleable buttonLabel='Add a new note'  ref={ toggleableRef }>
      <h3>Create a new Note</h3>

      <form onSubmit={ handleSubmit }>
        <div>
          <input
            placeholder='Note content...'
            value={ newNote }
            onChange={ handleChange }
          />
        </div>
        <button type="submit">Save</button>
      </form>
      <div>
        <button onClick={ handleLogout }>
          Log Out
        </button>
      </div>
    </ Toggleable>
  )
}