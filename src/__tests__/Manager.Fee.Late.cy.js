import { mount } from '@cypress/react'
import App from '../App'
import { manager1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import { fee1Mock, lateFeesMock, manager1Mock, payment1Mock, student1Mock, whoamiManagerMock } from './mocks/responses'

describe(specTitle('Manager.Fee.Late'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.intercept('GET', `/whoami`, whoamiManagerMock).as('getWhoami')
    cy.intercept('GET', `/managers/${manager1Mock.id}`, req => {
      req.reply(res => {
        res.setDelay(200)
        res.send(manager1Mock)
      })
    }).as('getManager1')
    cy.intercept('GET', `/fees?status=LATE&page=1&page_size=500`, lateFeesMock).as('getLateFees')
    cy.intercept('GET', `/students/${student1Mock.id}`, student1Mock).as('getStudent1')
    cy.intercept('GET', `/students/${student1Mock.id}/fees/${fee1Mock.id}/payments?page=1&page_size=10`, [payment1Mock]).as('getfees')
    cy.intercept('GET', `/students/${student1Mock.id}/fees/${fee1Mock.id}`, fee1Mock).as('getFee1')
    cy.get('#username').type(manager1.username)
    cy.get('#password').type(manager1.password)
    cy.get('button').contains('Connexion').click()
    cy.wait('@getManager1')
    cy.wait('@getWhoami')
  })

  it('can list late fees', () => {
    cy.get('[data-testid="students-menu"]').click()
    cy.get('a[href="#/fees"]').click() // Étudiants category
    cy.get('td input[type="checkbox"]', { timeout: 50 }).should('not.exist')
    cy.get('.MuiTableBody-root > :nth-child(1) > .column-due_datetime').click()
    cy.contains('En retard')
  })
})
