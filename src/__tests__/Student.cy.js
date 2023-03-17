import { mount } from '@cypress/react'
import App from '../App'
import { student1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import { createPaymentMock, feesMock, student1Mock, studentNameToBeCheckedMock, whoamiStudentMock } from './mocks/responses'

describe(specTitle('Student'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').type('test+ryan@hei.school')
    cy.get('#password').type('oojohc5Z IeYu9aek&')
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
    cy.get('#first_name').contains(studentNameToBeCheckedMock)
  })

  it('can detail fee (click on fee row)', () => {
    cy.intercept('GET', `/students/${student1Mock.id}/fees?page=1&page_size=500`, feesMock).as('getFees')
    cy.get(`[href="#/students/${student1Mock.id}/fees"]`).click()
    cy.get('body').click(200, 0) //note(uncover-menu)
    cy.contains('200,000 Ar').click()
    cy.contains('En retard')
  })

  it('can detail fee (click on fee button)', () => {
    cy.get(`[href="#/students/${student1Mock.id}/fees"]`).click()
    cy.get('body')
      .click(200, 0) //note(uncover-menu)
      .wait(['@getStudent', '@getWhoami'])
    cy.get(':nth-child(7) > :nth-child(5)').click()
    cy.contains('En retard')
  })

  it('Displays "Unavailable" if the location is null', () => {
    student1Mock.location = null
    cy.contains('Unavailable')
  })

  it('Displays the longitude and latitude when location is defined', () => {
    const longitude = student1Mock.location.longitude
    const latitude = student1Mock.location.latitude
    cy.get('#location').should('contain', `${longitude}, ${latitude}`)
  })
})
