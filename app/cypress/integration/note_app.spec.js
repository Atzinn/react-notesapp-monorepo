describe('Note app', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      "username": "elqueso",
      "name": "atzin",
      "password": "pass"
    }
    cy.request('POST', 'http://localhost:3001/api/users', user)
  })
  it('frontpage can be open', () => {
    cy.contains('Notes')
  })

  it('login form can be open', () => {
    cy.contains('Show Login').click()
  })

  it('user can login', () => {
    cy.contains('Show Login').click()
    cy.get('[placeholder="Username"]').type('elqueso')
    cy.get('[placeholder="Password"]').type('pass')
    cy.get('#login-button').click()
    cy.contains('Create a new Note')
  })

  it('login fails with wrong password', () => {
    cy.contains('Show Login').click()
    cy.get('[placeholder="Username"]').type('elqueso')
    cy.get('[placeholder="Password"]').type('wrongpass')
    cy.get('#login-button').click()

    cy.get('.error')
      .should('contain', 'Wrong credentials')
      .should('have.css', 'color', 'rgb(255, 0, 0)')
  })

  describe('when user logged in', () => {
    beforeEach(() => {
      cy.login({
        username: 'elqueso',
        password: 'pass'
      })
    })

    it('a new note can be create', () => {
      const noteContent = 'A note created by Cypress'
      cy.contains('Add a new note').click()
      cy.get('input').type(noteContent)
      cy.contains('Save').click()
      cy.contains(noteContent)
    })

    describe('and a note exists', () => {
      beforeEach(() => {
        cy.createNote({
          content: 'this is the first note created from cypress',
          important: false
        })
        cy.createNote({
          content: 'this is the second note created from cypress',
          important: false
        })
        cy.createNote({
          content: 'this is the third note created from cypress',
          important: false
        })
      })

      it('it can be made important', () => {
        cy.contains('this is the second note created from cypress').as('theNote')
        
        cy.get('@theNote').contains('make important').click()
        
        cy.get('@theNote').contains('make not important')
      })
    })
  })
})