import React, { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes  from 'prop-types'
import i18n from '../i18n/index'

const Toggleable = forwardRef(({ children, buttonLabel }, ref) => {
  const [visible, setVisible] = useState(false)

  const hiddeWhenVisble = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => setVisible(!visible)

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={ hiddeWhenVisble }>
        <button onClick={ toggleVisibility }>{ buttonLabel }</button>
      </div>
      <div style={ showWhenVisible }>
        { children }
        <button onClick={ toggleVisibility }>{ i18n.TOGGLEABLE.BUTTON }</button>
      </div>
    </div>
  )
})

Toggleable.displayName = 'Toggleable'

Toggleable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}

export default Toggleable