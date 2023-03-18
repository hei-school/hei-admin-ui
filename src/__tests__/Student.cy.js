import { mount } from '@cypress/react'
import App from '../App'
import { student1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import {
  createPaymentMock,
  feesMock,
  student1Mock,
  studentNameToBeCheckedMock,
  whoamiStudentMock
} from './mocks/responses'

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
  })

  it('lands on profile page if succeeds', () => {
    cy.get('#first_name').contains(studentNameToBeCheckedMock)
  })

  it('student_location_ok', () => {
    cy.intercept('GET', `/students/${student1Mock.id}`, student1Mock).as('getStudent')

    cy.wait('@getStudent')
    cy.contains('Rafanomezantsoa')
    cy.contains('STD21111')
    cy.contains('test+ryan@hei.school')
    cy.contains(123456)
    cy.contains(156511651)
  })

  it('student_location_ko', () => {
    cy.intercept('GET', `/students/${student1Mock.id}`, { ...student1Mock, location: null }).as('getStudent')

    cy.wait('@getStudent')
    cy.contains('Rafanomezantsoa')
    cy.contains('STD21111')
    cy.contains('test+ryan@hei.school')
    cy.contains('Non renseigné')
  })
})
