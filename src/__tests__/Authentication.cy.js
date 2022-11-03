import { mount } from '@cypress/react'
import App from '../App'
import { student1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'

describe(specTitle('Authentication'), () => {
  it('remains on login page if fails', () => {
    mount(<App />)

    cy.get('button').contains('Connexion').click()
    cy.get('#username-helper-text').contains('Ce champ est requis')

    cy.get('#username').type(student1.username)
    cy.get('#password').type('bad password')
    cy.get('button').contains('Connexion').click()
    cy.contains('Incorrect username or password.')
  })
})
