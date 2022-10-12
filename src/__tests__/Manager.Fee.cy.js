import { mount, unmount } from '@cypress/react'
import App from '../App'
import { manager1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import { prettyPrintMoney } from '../operations/utils/money.ts'

describe(specTitle('Manager.Fee'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').type(manager1.username)
    cy.get('#password').type(manager1.password)
    cy.get('button').contains('Connexion').click()
    cy.get('a[href="#/profile"]').click()
    cy.get(':nth-child(3) > .MuiListItem-root').click()
    cy.get('a[href="#/students"]').click()
    cy.get('body').click(200, 0)
    cy.get('[data-testid="FilterListIcon"]').click()
    cy.get('[data-key="last_name"] > :nth-child(1)').click()
    cy.get('#last_name').click()
    cy.get('#last_name').type('Quitzon')
    cy.contains('Quitzon').click()
  })
  it('can detail waiting fee', () => {
    cy.get('.show-page > .MuiToolbar-root > .MuiTypography-root').click()
    cy.contains('200,000 Ar').click()
    cy.contains('En retard')
  })
  it('cannot create fees when fields are missing', () => {
    unmount()
    mount(<App />)

    cy.get('.show-page > .MuiToolbar-root > .MuiTypography-root').click()
    cy.get('.css-15bmcs9-MuiToolbar-root-RaListToolbar-root > .MuiToolbar-root > .MuiButtonBase-root').click()
    cy.get('#predefined_type_annualTuition1x').click()
    cy.contains('Enregistrer').click()

    cy.contains("Le formulaire n'est pas valide")
  })
  it('can create fees with predefined fields', () => {
    unmount()
    mount(<App />)

    cy.get('.show-page > .MuiToolbar-root > .MuiTypography-root').click()
    cy.get('.css-15bmcs9-MuiToolbar-root-RaListToolbar-root > .MuiToolbar-root > .MuiButtonBase-root').click()
    cy.get('#predefined_type_annualTuition1x').click()
    cy.get('#predefined_first_dueDate_jan22').click()
    cy.contains('Enregistrer').click()

    cy.contains('Élément créé')
  })
  it('can create fees with manual fields', () => {
    unmount()
    mount(<App />)

    cy.get('.show-page > .MuiToolbar-root > .MuiTypography-root').click()
    cy.get('.css-15bmcs9-MuiToolbar-root-RaListToolbar-root > .MuiToolbar-root > .MuiButtonBase-root').click()
    cy.get('#is_predefined_type').click()
    cy.get('#manual_type_tuition').click()
    const monthlyAmount = 1 + Math.floor(Math.random() * 2_000_000)
    cy.get('#monthly_amount').click().type(monthlyAmount)

    const monthsNumber = 1 + Math.floor(Math.random() * 3)
    cy.get('#months_number').click().type(monthsNumber)

    cy.get('#comment').click().type('Dummy comment')

    cy.get('#is_predefined_first_dueDate').click()
    cy.get('#manual_first_duedate').click().type(`2021-09-11`)

    cy.contains('Enregistrer').click()
    cy.contains('Élément créé')
    cy.get(`.MuiTableCell-alignRight:contains(${prettyPrintMoney(monthlyAmount)})`).should('have.length', monthsNumber)
  })
})
