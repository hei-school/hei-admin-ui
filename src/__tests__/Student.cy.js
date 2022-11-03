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

  it('can detail fee (click on fee row)', () => {
    cy.get('[href="#/students/student1_id/fees"]').click()
    cy.get('body').click(200, 0) //note(uncover-menu)
    cy.contains('200,000 Ar').click()
    cy.contains('En retard')
  })

  it('can detail fee (click on fee button)', () => {
    cy.get('[href="#/students/student1_id/fees"]').click()
    cy.get('body').click(200, 0) //note(uncover-menu)
    cy.get(':nth-child(7) > :nth-child(5)').click()
    cy.contains('En retard')
  })
})
