import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Toggleable from './Toggleable.jsx'

import loginService from '../services/login'

export default function LoginForm({ saveUserInState, handleLoginError }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleUsernameChange = ({ target }) => setUsername(target.value)
  const handlePasswordChange = ({ target }) => setPassword(target.value)

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password
      })
      
      saveUserInState(user)
      
      setUsername('')
      setPassword('')
    } catch(err) {
      handleLoginError('Wrong credentials')
      setTimeout(() =>{
        handleLoginError(null)
      }, 5000)
    }
  }

  return (
    <Toggleable buttonLabel='Show Login'>
      <form onSubmit={ handleLogin }>
        <div>
          <input type="text" value={ username } name='Username' placeholder='Username' onChange={ handleUsernameChange } />
        </div>
        <div>
          <input type="password" value={ password } name='Password' placeholder='Password' onChange={ handlePasswordChange } />
        </div>
        <button id="login-button">
          Login
        </button>
      </form>
    </Toggleable>
  )
}

LoginForm.propTypes = {
  saveUserInState: PropTypes.func.isRequired,
  handleLoginError: PropTypes.func.isRequired
}
