import { mount } from '@cypress/react'
import App from '../App'
import { student1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import { student1Mock, student1MockNoLocation } from './mocks/responses'

describe(specTitle('Student'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').type(student1.username)
    cy.get('#password').type(student1.password)
    cy.get('button').contains('Connexion').click()
    cy.intercept('GET', `/students/${student1Mock.id}`, student1Mock).as('getStudent')
    cy.intercept('GET', `/students/${student1Mock.id}`, student1MockNoLocation).as('getStudent')
  })

  it('show location details', () => {
    cy.intercept('GET', `/students/${student1Mock.id}`, student1Mock).as('getStudent')

    cy.get('#location > :nth-child(1)').contains(student1Mock.location.latitude)
    cy.get('#location > :nth-child(2)').contains(student1Mock.location.longitude)
  })

  it('show error message when api doesn"t support the new functionality', () => {
    const error = 'Pas de coordonée GPS'
    cy.intercept('GET', `/students/${student1Mock.id}`, student1MockNoLocation).as('getStudent')

    cy.get('#location > :nth-child(1)').contains(error)
  })
})
