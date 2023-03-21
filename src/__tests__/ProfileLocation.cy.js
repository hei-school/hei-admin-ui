import { mount, unmount } from '@cypress/react'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import App from '../App'
import { student1 } from './credentials'
import { student1Mock } from './mocks/responses'

describe(specTitle('Profile'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').type(student1.username)
    cy.get('#password').type(student1.password)
    cy.get('button').contains('Connexion').click()
    cy.intercept('GET', '/profile')
  })

  it('should return the user location', () => {
    cy.contains(`Latitude : ${student1Mock.location.split(',')[0]}`)
    cy.contains(`Longitude : ${student1Mock.location.split(',')[1]}`)
  })
})
