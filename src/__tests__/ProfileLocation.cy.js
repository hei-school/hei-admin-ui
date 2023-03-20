import { mount } from '@cypress/react'
import App from '../App'
import { student1 } from './credentials'
import { student1Mock, student1MockWithoutLocation } from './mocks/responses'

describe('Profile Location test', () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').type(student1.username)
    cy.get('#password').type(student1.password)
    cy.get('button').contains('Connexion').click()
    cy.intercept('GET', `/students/${student1Mock.id}`, student1Mock).as('getStudent')
  })
  it('shows coordinates if provided', () => {
    cy.get('#gps').contains(`${student1Mock.location.longitude}`)
    cy.get('#gps').contains(`${student1Mock.location.latitude}`)
  })

  it('tells that coordinates are unavailable if not provided', () => {
    cy.intercept('GET', `/students/${student1Mock.id}`, student1MockWithoutLocation).as('getStudent')
    cy.get('#gps').contains('Données indisponibles')
  })
})
