import { mount } from '@cypress/react'
import App from '../App'
import { manager1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import { prettyPrintMoney } from '../operations/utils/money.ts'

describe(specTitle('Manager.Payment'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').type(manager1.username)
    cy.get('#password').type(manager1.password)
    cy.get('button').contains('Connexion').click()
  })

  it('can add payment to a fee', () => {
    // note(listFees)
    cy.get(':nth-child(3) > .MuiListItem-root').click() // Étudiants category
    cy.get('a[href="#/students"]').click()
    cy.get('body').click(200, 0) //note(uncover-menu)
    cy.get('button').contains('Suivant').click()
    cy.get('[data-testid="FilterListIcon"]').click()
    cy.get('[data-key="ref"]').click()
    cy.get('#ref').type('STD21905955')
    cy.contains('STD21905955').click()
    cy.get('[aria-label="fees"]').click()

    cy.contains('Un grand montant à payer petit à petit').click()
    cy.contains('En attente')

    cy.get('.MuiFab-root').click()
    cy.get('#type_cash').click()

    const amount = 1 + Math.floor(Math.random() * 100_000)
    cy.get('#amount').click().type(amount)

    cy.get('#comment').click().type('Dummy comment')

    cy.contains('Enregistrer').click()
    cy.contains('Élément créé')
    cy.get(`.MuiTableCell-alignRight:contains(${prettyPrintMoney(amount)})`).should('have.length', 1)
  })
})
