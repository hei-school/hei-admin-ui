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
    // note(listFees)
    cy.get('button[title="Ouvrir le menu"').click()
    cy.get('a[href="#/students"]').click()
    cy.get('button').contains('Suivant').click()
    cy.get('button[title="Ajouter un filtre"').click()
    cy.get('[data-key="last_name"]').click()
    cy.get('#last_name').type('quitzon')
    cy.contains('Quitzon').click()
    cy.get('[aria-label="fees"]').click()

    cy.contains('200,000 Ar').click()
    cy.contains('En retard')
  })

  it('cannot create fees when fields are missing', () => {
    // note(listFees)
    cy.get('button[title="Ouvrir le menu"').click()
    cy.get('a[href="#/students"]').click()
    cy.get('button').contains('Suivant').click()
    cy.get('button[title="Ajouter un filtre"').click()
    cy.get('[data-key="last_name"]').click()
    cy.get('#last_name').type('quitzon')
    cy.contains('Quitzon').click()
    cy.get('[aria-label="fees"]').click()

    cy.get('.MuiFab-root').click() // create fees
    cy.contains('Enregistrer').click()

    cy.contains("Le formulaire n'est pas valide")
    cy.get('#monthly_amount-helper-text').contains('Ce champ est requis')
    cy.get('#months_number-helper-text').contains('Ce champ est requis')
    cy.get('#comment-helper-text').contains('Ce champ est requis')

    // when predefined, fields are required
    const typeHelperElt = ':nth-child(2) > .MuiFormControl-root > .MuiFormHelperText-root'
    const creationDateHelperElt = ':nth-child(5) > .MuiFormControl-root > .MuiFormHelperText-root'
    cy.get(typeHelperElt).contains('Ce champ est requis')
    cy.get(creationDateHelperElt).contains('Ce champ est requis')

    // when manual, fields are still required
    cy.get('.MuiIconButton-label > #is_predefined_type').click()
    cy.get('.MuiIconButton-label > #is_predefined_first_dueDate').click()
    cy.contains('Enregistrer').click()
    cy.get(typeHelperElt).contains('Ce champ est requis')
    cy.get(creationDateHelperElt).contains('Ce champ est requis')
  })

  it('can create fees with predefined fields', () => {
    // note(listFees)
    cy.get('button[title="Ouvrir le menu"').click()
    cy.get('a[href="#/students"]').click()
    cy.get('button').contains('Suivant').click()
    cy.get('button[title="Ajouter un filtre"').click()
    cy.get('[data-key="last_name"]').click()
    cy.get('#last_name').type('quitzon')
    cy.contains('Quitzon').click()
    cy.get('[aria-label="fees"]').click()

    cy.get('.MuiFab-root').click() // create fees
    cy.get('#predefined_type_annualTuition1x').click()
    cy.get('#predefined_first_dueDate_oct21').click()
    cy.contains('Enregistrer').click()
    cy.contains('Élément créé')
  })
})
