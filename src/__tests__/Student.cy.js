import { mount } from '@cypress/react'
import App from '../App'
import { student1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import { createPaymentMock, feesMock, student1Mock, studentNameToBeCheckedMock, whoamiStudentMock } from './mocks/responses'
import { FeeStatusEnum } from '../gen/haClient'

const newFeesMock = feesMock.slice(0, feesMock.length)
newFeesMock.forEach(element => {
  if (element.status != FeeStatusEnum.Paid && element.status != FeeStatusEnum.Unpaid && element.status != FeeStatusEnum.Late) {
    const avalaibleStatus = [FeeStatusEnum.Paid, FeeStatusEnum.Unpaid, FeeStatusEnum.Late]
    let min = 0
    let max = avalaibleStatus.length - 1
    element.status = avalaibleStatus[Math.random() * (max - min + 1) + min]
  }
})
describe(specTitle('Student'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').type(student1.username)
    cy.get('#password').type(student1.password)
    cy.get('button').contains('Connexion').click()
    cy.intercept('GET', `/students/${student1Mock.id}/fees?page=1&page_size=500`, newFeesMock).as('getFees')
    cy.intercept('GET', `/students/${student1Mock.id}`, student1Mock).as('getStudent')
    cy.intercept('GET', `/students/${student1Mock.id}/fees/${newFeesMock[7 - 1].id}/payments?page=1&page_size=10`, createPaymentMock(newFeesMock[7 - 1])).as(
      'getPaymentsOfFee1'
    )
    cy.intercept('GET', `/students/${student1Mock.id}/fees/${newFeesMock[0].id}/payments?page=1&page_size=10`, createPaymentMock(newFeesMock[0])).as(
      'getPaymentsOfFee2'
    )
    cy.intercept('GET', `/students/${student1Mock.id}/fees/${newFeesMock[7 - 1].id}`, newFeesMock[7 - 1]).as('getFee1')
    cy.intercept('GET', `/students/${student1Mock.id}/fees/${newFeesMock[0].id}`, newFeesMock[0]).as('getFee2')
    cy.intercept('GET', `/whoami`, whoamiStudentMock).as('getWhoami')
  })

  it('lands on profile page if succeeds', () => {
    cy.get('#first_name').contains(studentNameToBeCheckedMock)
  })

  it('can list fees', () => {
    cy.intercept('GET', `/students/${student1Mock.id}/fees?page=1&pageconst totalNumbers = _size=500`, newFeesMock).as('getFees')
    cy.get(`[href="#/students/${student1Mock.id}/fees"]`).click()
    cy.get('body').click(200, 0) //note(uncover-menu)
    cy.contains('200,000 Ar')
  })

  it('can detail fee (click on fee button)', () => {
    cy.get(`[href="#/students/${student1Mock.id}/fees"]`).click()
    cy.get('body')
      .click(200, 0) //note(uncover-menu)
      .wait(['@getStudent', '@getWhoami'])
    cy.get(':nth-child(7) > :nth-child(5)').click()
    cy.contains('En retard')
  })
})
