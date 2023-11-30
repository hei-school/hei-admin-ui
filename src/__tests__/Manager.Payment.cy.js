import { mount, unmount } from '@cypress/react'
import App from '../App'
import { manager1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import { prettyPrintMoney } from '../operations/utils'
import {
  createPaymentWithAmountMock,
  feesMock,
  unpaidFeeMock,
  manager1Mock,
  payment1Mock,
  student1Mock,
  studentsMock,
  UpdateFeeWithPaymentMock,
  whoamiManagerMock
} from './mocks/responses'

const amount = 1 + Math.floor(Math.random() * 100_000)
const createPayment = createPaymentWithAmountMock(amount)

describe(specTitle('Manager.Payment'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').type(manager1.username)
    cy.get('#password').type(manager1.password)
    cy.get('button').contains('Connexion').click()
    cy.intercept('GET', `/whoami`, whoamiManagerMock).as('getWhoami')
    cy.intercept('GET', `/managers/${manager1Mock.id}`, req => {
      req.reply(res => {
        res.setDelay(500)
        res.send(manager1Mock)
      })
    }).as('getManager1')
    cy.intercept('GET', `/students?page=1&page_size=10`, studentsMock).as('getStudentsPage1')
    cy.intercept('GET', `/students?page=2&page_size=10`, studentsMock).as('getStudentsPage2')
    cy.intercept('GET', `students?page=1&page_size=10&ref=${student1Mock.ref}`, [student1Mock]).as('getStudents')
    cy.intercept('GET', `/students/${student1Mock.id}`, student1Mock).as('getStudent1')
    cy.intercept('GET', `/students/${student1Mock.id}/fees?page=1&page_size=500`, feesMock).as('getfees')
    cy.intercept('GET', `/students/${student1Mock.id}/fees/${unpaidFeeMock.id}`, unpaidFeeMock).as('getUnpaidFee')
    cy.intercept('GET', `/students/${student1Mock.id}/fees/${unpaidFeeMock.id}/payments?page=1&page_size=10`, []).as('getPaymentOfUnpaidFee')
    cy.intercept('POST', `/students/${student1Mock.id}/fees/${unpaidFeeMock.id}/payments`, [payment1Mock]).as('addPayments')
    cy.wait('@getManager1')
    cy.get('[data-testid="students-menu"]').click() // Étudiants category
    cy.get('a[href="#/students"]').click()
    cy.get('button').contains('Suivant').click()
    cy.get('[data-testid="menu-list-action"]').click()
    cy.get('[data-testid="add-filter"]').click()
    cy.get('[data-testid="filter-profile-ref"]').type(student1Mock.ref)
    cy.get('[data-testid="apply-filter"]').click()
    cy.get('table').contains(student1Mock.ref).click()
    cy.get('[aria-label="fees"]').click()

    cy.contains(unpaidFeeMock.comment).click()
    cy.contains('En attente')
    cy.get('.MuiFab-root').click()
    cy.intercept('GET', `/students/${student1Mock.id}/fees/${unpaidFeeMock.id}/payments?page=1&page_size=10`, [createPayment]).as('getPayment')
    cy.intercept('GET', `/students/${student1Mock.id}/fees/${unpaidFeeMock.id}`, UpdateFeeWithPaymentMock(unpaidFeeMock, createPayment)).as('getFee')
  })

  it('can add cash payment to a fee', () => {
    cy.get('#type_CASH').click()
    cy.get('#amount').click().type(createPayment.amount)
    cy.get('#comment').click().type(createPayment.comment)
    cy.contains('Enregistrer').click()
    cy.contains('Élément créé')
    cy.get(`.MuiTableCell-alignRight:contains(${prettyPrintMoney(amount)})`).should('have.length', 1)
    cy.get('td input[type="checkbox"]', { timeout: 50 }).should('not.exist')
    unmount()
  })
  it('can add mobile money payment to a fee', () => {
    cy.get('#type_MOBILE_MONEY').click()
    cy.get('#amount').click().type(createPayment.amount)
    cy.get('#comment').click().type(createPayment.comment)
    cy.contains('Enregistrer').click()
    cy.contains('Élément créé')
    cy.get(`.MuiTableCell-alignRight:contains(${prettyPrintMoney(amount)})`).should('have.length', 1)
    unmount()
  })
  it("can't add mobile money payment to a fee without comment", () => {
    cy.get('#type_MOBILE_MONEY').click()
    cy.get('#amount').click().type(createPayment.amount)
    cy.contains('Enregistrer').click()
    cy.contains("Le formulaire n'est pas valide.")
    unmount()
  })
  it('can add bank payment to a fee', () => {
    cy.get('#type_BANK_TRANSFER').click()
    cy.get('#amount').click().type(createPayment.amount)
    cy.get('#comment').click().type(createPayment.comment)
    cy.get('#ref').click().type(amount)
    cy.get('#specify-date').click()
    cy.get('#creation_datetime').click().type('2023-11-24')
    cy.contains('Enregistrer').click()
    cy.contains('Élément créé')
    cy.get(`.MuiTableCell-alignRight:contains(${prettyPrintMoney(amount)})`).should('have.length', 1)
    unmount()
  })
})
