import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import i18n from '../i18n/index'

import Toggleable from './Toggleable'

describe('<Toggleable />', () => {
  const buttonLabel = 'Show'
  let component

  beforeEach(() => {
    component = render(      
      <Toggleable buttonLabel={ buttonLabel }>
        <div>Test Div Content</div>
      </Toggleable>
    )
  })

  test('renders its children', () =>{
    component.getByText('Test Div Content')
  })

  test('renders its children but they are not visible', () =>{
    const el = component.getByText('Test Div Content')
    expect(el.parentNode).toHaveStyle('display: none')
  })

  test('after clicking its children must be shown', () =>{
    const button = component.getByText(buttonLabel)
    fireEvent.click(button)
    
    const el = component.getByText('Test Div Content')
    expect(el.parentNode).not.toHaveStyle('display: none')
  })

  test('toggled content can be closed', () => {
    const button = component.getByText(buttonLabel)
    fireEvent.click(button)
    
    const el = component.getByText('Test Div Content')
    expect(el.parentNode).not.toHaveStyle('display: none')
    
    const cancelButton = component.getByText(i18n.TOGGLEABLE.BUTTON)
    fireEvent.click(cancelButton)

    expect(el.parentNode).toHaveStyle('display: none')
  })
})