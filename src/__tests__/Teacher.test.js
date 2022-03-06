import { mount } from '@cypress/react'
import App from '../App'
import { teacher1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'

describe(specTitle('Teacher'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').type(teacher1.username)
    cy.get('#password').type(teacher1.password)
    cy.get('button').contains('Connexion').click()
  })

  it('lands on profile page if succeeds', () => {
    cy.get('#first_name').contains('One')
  })

  it('can list and filter students', () => {
    cy.get('button[title="Ouvrir le menu"').click()
    cy.get('a[href="#/students"]').click() // Étudiants menu
    cy.contains('Page : 1')
    cy.contains('Taille : 10')

    cy.get('button').contains('Suivant').click()
    cy.contains('Page : 2')

    cy.get('button[title="Ajouter un filtre"').click()
    cy.get('[data-key="last_name"]').click()
    cy.get('#last_name').type('quitzon')
    cy.contains('Page : 1')
    cy.contains('Taille : 1')
  })
})
