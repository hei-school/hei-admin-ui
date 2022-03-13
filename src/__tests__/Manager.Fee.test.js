import { mount } from '@cypress/react'
import App from '../App'
import { manager1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'

describe(specTitle('Manager.Fee'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').type(manager1.username)
    cy.get('#password').type(manager1.password)
    cy.get('button').contains('Connexion').click()
  })

  it('can detail late fee', () => {
    // note(listAndFilterStudents)
    cy.get('button[title="Ouvrir le menu"').click()
    cy.get('a[href="#/students"]').click() // Étudiants menu
    cy.get('button').contains('Suivant').click()
    cy.get('button[title="Ajouter un filtre"').click()
    cy.get('[data-key="last_name"]').click()
    cy.get('#last_name').type('quitzon')

    cy.contains('Quitzon').click()
    cy.get('[aria-label="fees"]').click()

    cy.contains('200,000 Ar').click()
    cy.contains('En retard')
  })
})
