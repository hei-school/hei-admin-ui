import { mount } from '@cypress/react'
import App from '../App'
import '../../cypress/support/commands'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import { fee1Mock, lateFeesMock, manager1Mock, payment1Mock, student1Mock } from './mocks/responses'
import { WhoamiRoleEnum } from '../gen/haClient'

describe(specTitle('Manager.Fee.Late'), () => {
  beforeEach(() => {
    mount(<App />)

    cy.intercept('GET', `/managers/${manager1Mock.id}`, manager1Mock).as('getManager1')
    cy.intercept('GET', `/fees?status=LATE&page=1&page_size=500`, lateFeesMock).as('getLateFees')
    cy.intercept('GET', `/students/${student1Mock.id}`, student1Mock).as('getStudent1')
    cy.intercept('GET', `/students/${student1Mock.id}/fees/${fee1Mock.id}/payments?page=1&page_size=10`, [payment1Mock]).as('getfees')
    cy.intercept('GET', `/students/${student1Mock.id}/fees/${fee1Mock.id}`, fee1Mock).as('getFee1')

    cy.cognitoLogin(WhoamiRoleEnum.Manager)

    cy.wait('@getManager1')
    cy.wait('@getWhoami')
  })

  it('can list late fees', () => {
    cy.get(':nth-child(3) > .MuiListItem-root').click()
    cy.get('a[href="#/fees"]').click({ multiple: true, force: true }) // Étudiants category
    cy.get('body').click(200, 0) //note(uncover-menu)
    cy.get('td input[type="checkbox"]', { timeout: 50 }).should('not.exist')
    cy.get('.MuiTableBody-root > :nth-child(1) > .column-due_datetime').click()
    cy.contains('En retard')
  })
})
