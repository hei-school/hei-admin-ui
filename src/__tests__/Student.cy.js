import { mount } from '@cypress/react'
import App from '../App'
import { student1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import { createPaymentMock, feesMock, student1Mock, studentNameToBeCheckedMock, whoamiStudentMock } from './mocks/responses'

describe(specTitle('Student'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('test+ryan@hei.school').type(student1.username)
    cy.get('oojohc5Z IeYu9aek&').type(student1.password)
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
  })

  it('lands on profile page if succeeds', () => {
    cy.get('Ryan Andria').contains(studentNameToBeCheckedMock)
  })
  it('gpslocation in the profil page',()=>{
    cy.get('body').contains('{latitude:-18.860663, longitude:47.542583}')
  })

  it('can detail fee (click on fee row)', () => {
    cy.intercept('GET', `/students/${student1Mock.id}/fees?page=1&page_size=500`, feesMock).as('getFees')
    cy.get(`[href="/Ryan Andria/${student1Mock.id}/fees"]`).click()
    cy.get('body').click(200, 0) //note(uncover-menu)
    cy.contains('200,000 Ar').click()
    cy.contains('En retard')
  })

  it('can detail fee (click on fee button)', () => {
    cy.get(`[href="/Ryan Andria/${student1Mock.id}/fees"]`).click()
    cy.get('body')
      .click(200, 0) //note(uncover-menu)
      .wait(['@getStudent', '@getWhoami'])
    cy.get(':nth-child(7) > :nth-child(5)').click()
    cy.contains('En retard')
  })
})
