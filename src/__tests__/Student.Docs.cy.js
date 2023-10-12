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

  it('can show three types of docs when the icon is clicked', () => {
    cy.get('[data-testid="InventoryIcon"] > path').click()
    cy.contains('HEI')
    cy.contains('Vos informations')
    cy.contains('Bulletins')
    unmount()
  })
})
