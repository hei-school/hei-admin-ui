import { mount } from '@cypress/react'
import App from '../App'
import { student1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'

describe(specTitle('Student'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').type(student1.username)
    cy.get('#password').type(student1.password)
    cy.get('button').contains('Connexion').click()
  })

  it('lands on profile page if succeeds', () => {
    cy.get('#first_name').contains('Ryan')
  })

  it('can detail fee', () => {
    cy.get('button[title="Ouvrir le menu"').click()
    cy.get('[href="#/students/student1_id/fees"]').click()
    cy.contains('200,000 Ar').click()
    cy.contains('En attente')
  })
})
