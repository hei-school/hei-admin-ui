import { mount, unmount } from '@cypress/react'
import App from '../App'
import { student1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import { createPaymentMock, feesMock, student1Mock, studentNameToBeCheckedMock, whoamiStudentMock } from './mocks/responses'

describe(specTitle('Student'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').type(student1.username)
    cy.get('#password').type(student1.password)
    cy.get('button').contains('Connexion').click()
    cy.intercept('GET', `/students/${student1Mock.id}/fees?page=1&page_size=500`, feesMock).as('getFees')
    cy.intercept('GET', `/students/${student1Mock.id}`, student1Mock).as('getStudent')
    cy.intercept('GET', `/students/${student1Mock.id}/fees/${feesMock[7 - 1].id}/payments?page=1&page_size=10`, createPaymentMock(feesMock[7 - 1])).as(
      'getPaymentsOfFee1'
    )
    cy.intercept('GET', `/students/${student1Mock.id}/fees/${feesMock[0].id}/payments?page=1&page_size=10`, createPaymentMock(feesMock[0])).as(
      'getPaymentsOfFee2'
    )
    cy.intercept('GET', `/students/${student1Mock.id}/fees/${feesMock[7 - 1].id}`, feesMock[7 - 1]).as('getFee1')
    cy.intercept('GET', `/students/${student1Mock.id}/fees/${feesMock[0].id}`, feesMock[0]).as('getFee2')
    cy.intercept('GET', `/whoami`, whoamiStudentMock).as('getWhoami')
    cy.wait('@getStudent')
  })

  it('lands on profile page if succeeds', () => {
    cy.get('[href="#/profile"]').click()
    cy.get('#first_name').contains(studentNameToBeCheckedMock)
    cy.get('#main-content')
      .should('contain', student1Mock.ref)
      .and('contain', student1Mock.last_name)
      .and('contain', student1Mock.address)
      .and('contain', student1Mock.email)
      .and('contain', student1Mock.phone)
    cy.get('[data-testid="MenuIcon"]').click()
    cy.get('#ha-menu')
      .should('not.contain', 'Enseignants', { timeout: 50 })
      .and('not.contain', 'Étudiants', { timeout: 50 })
      .and('contain', 'Frais')
      .and('contain', 'Notes')
    cy.get('[href="#/profile"]').click()
    //cy.get('.RaBreadcrumb-list').should('not.contain', 'CRÉER').and('not.contain', 'ÉDITER')
    unmount()
  })

  it('can list fees', () => {
    cy.intercept('GET', `/students/${student1Mock.id}/fees?page=1&page_size=500`, feesMock).as('getFees')
    cy.get(`[href="#/students/${student1Mock.id}/fees"]`).click()
    cy.wait('@getFees')
    cy.get('td input[type="checkbox"]', { timeout: 50 }).should('not.exist')
    cy.get('td a').should('not.contain', 'ÉDITER', { timeout: 50 })
    //cy.get('.RaBreadcrumb-list').should('not.contain', 'CRÉER', { timeout: 50 })
    cy.get('body').click(200, 0) //note(uncover-menu)
    cy.contains('200,000 Ar').click()
    cy.get('#main-content').should('contain', 'Paiements')
    cy.get('td input[type="checkbox"]', { timeout: 50 }).should('not.exist')
    cy.get('td').should('not.contain', 'ÉDITER', { timeout: 50 })
    cy.get('.RaList-main').should('not.contain', 'CRÉER', { timeout: 50 })
    cy.contains('En retard')
    unmount()
  })

  it('can detail fee (click on fee button)', () => {
    cy.get(`[href="#/students/${student1Mock.id}/fees"]`).click()
    cy.get('body')
      .click(200, 0) //note(uncover-menu)
      .wait(['@getStudent', '@getWhoami'])
    cy.get(':nth-child(7) > :nth-child(5)').click()
    cy.contains('En retard')
    unmount()
  })
})
