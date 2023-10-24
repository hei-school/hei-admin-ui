import { mount, unmount } from '@cypress/react'
import App from '../App'
import { student1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import { student1Mock, whoamiStudentMock } from './mocks/responses'

describe(specTitle('Student'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').type(student1.username)
    cy.get('#password').type(student1.password)
    cy.get('button').contains('Connexion').click()
    cy.intercept('GET', `/students/${student1Mock.id}`, student1Mock).as('getStudent')
    cy.intercept('GET', `/whoami`, whoamiStudentMock).as('getWhoami')
  })

  it('can show the list of heis docs', () => {
    cy.wait('@getStudent')
    cy.get('[data-testid="InventoryIcon"] > path').click()
    cy.get('[href="#/hei-docs"]').click()
    cy.contains('Date de création')
    cy.contains('Afficher')
  })
  it('can show a heis doc', () => {
    cy.get('[data-testid="InventoryIcon"] > path').click()
    cy.get('[href="#/hei-docs"]').click()
    cy.contains('Date de création')
    cy.contains('Afficher')
    cy.get('.column-fileName > .MuiTypography-root').click()
    cy.contains("Visualisation d'un document")
    unmount()
  })
})
