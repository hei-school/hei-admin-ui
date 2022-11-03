import { mount, unmount } from '@cypress/react'
import App from '../App'
import { manager1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'

describe(specTitle('Manager.Fee.Late'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').type(manager1.username)
    cy.get('#password').type(manager1.password)
    cy.get('button').contains('Connexion').click()
    cy.get('a[href="#/profile"]').click()
  })

  it('can list late fees', () => {
    cy.get(':nth-child(3) > .MuiListItem-root').click()
    cy.get('a[href="#/fees"]').click({ multiple: true, force: true }) // Étudiants category
    cy.get('body').click(200, 0) //note(uncover-menu)
    cy.get('.MuiTableBody-root > :nth-child(1) > .column-due_datetime').click()
    cy.contains('En retard')
  })
})
