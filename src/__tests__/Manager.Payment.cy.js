import { mount } from '@cypress/react'
import App from '../App'
import { manager1, student1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import { prettyPrintMoney } from '../operations/utils/money.ts'
import {
  creatPaymentMockWithAmaunt,
  fee1Mock,
  feesMock,
  feeUnpaidMock,
  manager1Mock,
  payment1Mock,
  student1Mock,
  studentsMock,
  whoamiManagerMock
} from './mocks/responses'

describe(specTitle('Manager.Payment'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').type(manager1.username)
    cy.get('#password').type(manager1.password)
    cy.get('button').contains('Connexion').click()
    cy.intercept('GET', `/whoami`, whoamiManagerMock).as('getWhoami')
    cy.intercept('GET', `/managers/${manager1Mock.id}`, manager1Mock).as('getManager1')
    cy.intercept('GET', `/students?page=1&page_size=10`, studentsMock).as('getStudents')
    cy.intercept('GET', `/students?page=2&page_size=10`, studentsMock).as('getStudents')
    cy.intercept('GET', `students?page=1&page_size=10&ref=${student1Mock.ref}`, [student1Mock]).as('getStudents')
    cy.intercept('GET', `/students/${student1Mock.id}`, student1Mock).as('getStudent')
    cy.intercept('GET', `/students/${student1Mock.id}/fees?page=1&page_size=500`, feesMock).as('getStudent')
    cy.intercept('GET', `/students/${student1Mock.id}/fees/${feeUnpaidMock.id}`, feeUnpaidMock).as('getFee')
    cy.intercept('GET', `/students/${student1Mock.id}/fees/${feeUnpaidMock.id}/payments?page=1&page_size=10`, []).as('getFee')
    cy.intercept('POST', `/students/${student1Mock.id}/fees/${feeUnpaidMock.id}/payments`, [payment1Mock]).as('getFee')
  })

  it('can add payment to a fee', () => {
    // note(listFees)
    cy.wait('@getManager1')
    cy.wait('@getWhoami')
    cy.get(':nth-child(1) > .MuiListItem-root').click()
    cy.get(':nth-child(3) > .MuiListItem-root').click() // Étudiants category
    cy.get('a[href="#/students"]').click()
    cy.get('body').click(200, 0) //note(uncover-menu)
    cy.get('button').contains('Suivant').click()
    cy.get('[data-testid="FilterListIcon"]').click()
    cy.get('[data-key="ref"]').click()
    cy.get('#ref').type(student1Mock.ref)
    cy.contains(student1Mock.ref).click()
    cy.get('[aria-label="fees"]').click()

    cy.contains('Un grand montant à payer petit à petit').click()
    cy.contains('En attente')

    cy.get('.MuiFab-root').click()
    cy.get('#type_cash').click()

    const amount = 1 + Math.floor(Math.random() * 100_000)
    cy.intercept('GET', `/students/${student1Mock.id}/fees/${feeUnpaidMock.id}/payments?page=1&page_size=10`, [creatPaymentMockWithAmaunt(amount)]).as('getFee')
    cy.get('#amount').click().type(amount)

    cy.get('#comment').click().type('Dummy comment')

    cy.contains('Enregistrer').click()
    cy.contains('Élément créé')
    cy.get(`.MuiTableCell-alignRight:contains(${prettyPrintMoney(amount)})`).should('have.length', 1)
  })
})
