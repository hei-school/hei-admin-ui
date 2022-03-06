import { mount } from '@cypress/react'
import App from '../App'
import { manager1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'

describe(specTitle('Manager'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').type(manager1.username)
    cy.get('#password').type(manager1.password)
    cy.get('button').contains('Connexion').click()
  })

  it('lands on profile page if succeeds', () => {
    cy.get('#first_name').contains('One')
  })

  it('can list and filter students', () => {
    // note(listAndFilterStudents)
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

  it('can list and filter teachers', () => {
    cy.get('button[title="Ouvrir le menu"').click()
    cy.get('a[href="#/teachers"]').click() // Enseignants menu
    cy.contains('Page : 1')
    cy.contains('Taille : 10')

    cy.get('button').contains('Suivant').click()
    cy.contains('Page : 2')

    cy.get('#first_name').type('bozy')
    cy.contains('Page : 1')
    cy.contains('Taille : 1')
  })
})
