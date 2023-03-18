import { mount } from '@cypress/react'
import App from '../App'
import { student1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import {
  createPaymentMock,
  feesMock,
  student1Mock,
  student1MockWithLocation,
  student2Mock,
  studentNameToBeCheckedMock,
  whoamiStudentMock
} from './mocks/responses'

describe(specTitle('Student'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').type(student1.username)
    cy.get('#password').type(student1.password)
    cy.get('button').contains('Connexion').click()
    cy.intercept('GET', '/profile').as('getStudent')
    cy.intercept('GET', `/whoami`, whoamiStudentMock).as('getWhoami')
  })

  it('display student location if exist', () => {
    cy.intercept('GET', `/students/${student1Mock.id}`, student1Mock).as('getStudent')
    cy.viewport(1000, 500)
    cy.get('#location').contains('Indéfini')
    cy.get('#location').contains('Indéfini')
  })

  it('handle student location if not exist', () => {
    cy.intercept('GET', `/students/${student1MockWithLocation.id}`, student1MockWithLocation).as('getStudent')
    cy.get('#location').contains(student1MockWithLocation.location.latitude)
    cy.get('#location').contains(student1MockWithLocation.location.longitude)
  })
})
