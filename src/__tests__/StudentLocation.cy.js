import { mount } from '@cypress/react'
import App from '../App'
import { student1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import { createPaymentMock, feesMock, student1Mock, studentMockWithoutLocation, studentNameToBeCheckedMock, whoamiStudentMock } from './mocks/responses'

describe(specTitle('Student'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').type(student1.username)
    cy.get('#password').type(student1.password)
    cy.get('button').contains('Connexion').click()
    cy.intercept('GET', `/students/${student1Mock.id}/fees?page=1&page_size=500`, feesMock).as('getFees')
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

  it('read student profile with location', () => {
    cy.intercept('GET', `/students/${student1Mock.id}`, student1Mock).as('getStudent')

    cy.get('#latitude').contains(9)
    cy.get('#longitude').contains(14)
  })

  it('read student profile without location', () => {
    cy.intercept('GET', `/students/${student1Mock.id}`, studentMockWithoutLocation).as('getStudent')

    cy.get('#first_name').contains('Ny Hasina Marolahy')

    cy.get('#latitude').contains("Nous n'avons pas pu déterminer la latitude.")
    cy.get('#longitude').contains("Nous n'avons pas pu déterminer la longitude.")
  })
})
