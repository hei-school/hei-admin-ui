import { mount } from '@cypress/react'
import App from '../App'
import { student1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import { createPaymentMock, feesMock, student1Mock,student1MockWithoutLocation,student1MockWithWrongLocation, gpsAddressToBeCheckedMock, studentNameToBeCheckedMock, whoamiStudentMock } from './mocks/responses'

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
  
    it('have a mock gps address', () => {
      cy.get('#location').contains(gpsAddressToBeCheckedMock)
    })

    const gpsMissingValueToBeCheckedMock = "Pas d'addresse gps"
    it('shows default value if no location', () => {
        cy.intercept('GET', `/students/${student1Mock.id}`, student1MockWithoutLocation).as('getStudent')
        cy.get('#location').contains(gpsMissingValueToBeCheckedMock)
    })

    const gpsErrorValueToBeCheckedMock = "Valeur Gps manquante"
    it('shows error message if values are incorrect', () => {
        cy.intercept('GET', `/students/${student1Mock.id}`, student1MockWithWrongLocation).as('getStudent')
        cy.get('#location').contains(gpsErrorValueToBeCheckedMock)
    })
  })