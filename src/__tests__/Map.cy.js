import { mount } from '@cypress/react'
import App from '../App'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import { createPaymentMock, feesMock, student1Mock, student1MockWithLocation, studentNameToBeCheckedMock, whoamiStudentMock } from './mocks/responses'

describe(specTitle('Student'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').type('test+ryan@hei.school')
    cy.get('#password').type(process.env.REACT_APP_TEST_STUDENT1_PASSWORD)
    cy.get('button').contains('Connexion').click()
  })
  it('handle a specific message if location isn`t defined', () => {
    cy.get(`[href="#/profile"]`).click()
    cy.contains('Adresse GPS Non spécifiée')
  })

  it('can give a map if there are location', () => {
    cy.get(`[href="#/profile"]`).click()
    cy.intercept('GET', `/students/${student1MockWithLocation}`, student1MockWithLocation).as('getStudentWithLocation')
    cy.get('#gps').should('be.visible')
  })
})
