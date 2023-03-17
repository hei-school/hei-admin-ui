import specTitle from "cypress-sonarqube-reporter/specTitle";
import { student1 } from "./credentials";
import { createPaymentMock, feesMock, student1Mock, whoamiStudentMock } from './mocks/responses';
import { mount } from '@cypress/react';
import App from '../App';

describe(specTitle("GpsLocation"), () => {
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

  it('should contain GPSLocation', () => {
    cy.wait(["@getWhoami"]).get().should("contain", "no gps location")
  })
})