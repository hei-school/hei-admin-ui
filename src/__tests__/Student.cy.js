import { mount } from '@cypress/react'
import App from '../App'
import { student1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import { fee1Mock, feelsMock, payment1Mock, student1Mock, studentNameToBeCheckedMock, whoamiStudentMock } from './mocks/responses'

describe(specTitle('Student'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').type(student1.username)
    cy.get('#password').type(student1.password)
    cy.get('button').contains('Connexion').click()
  })

  it('lands on profile page if succeeds', () => {
    cy.intercept('GET', `/whoami`, whoamiStudentMock).as('getWhoami')
    cy.intercept('GET', `/students/${student1Mock.id}`, student1Mock).as('getStudent')
    cy.get('#first_name').contains(studentNameToBeCheckedMock)
  })

  it('can detail fee (click on fee row)', () => {
    cy.intercept('GET', `/students/${student1Mock.id}/fees?page=1&page_size=500`, feelsMock).as('getFees')
    cy.intercept('GET', `/students/${student1Mock.id}`, student1Mock).as('getStudent')
    cy.intercept('GET', `/whoami`, whoamiStudentMock).as('getWhoami')
    cy.get(`[href="#/students/${student1Mock.id}/fees"]`).click()
    cy.get('body').click(200, 0) //note(uncover-menu)
    cy.contains('200,000 Ar').click()
    cy.contains('En retard')
  })

  it('can detail fee (click on fee button)', () => {
    cy.intercept('GET', `/students/${student1Mock.id}/fees?page=1&page_size=500`, feelsMock).as('getFees')
    cy.intercept('GET', `/students/${student1Mock.id}`, student1Mock).as('getStudent')
    cy.intercept('GET', `/students/${student1Mock.id}/fees/${feelsMock[7 - 1].id}/payments?page=1&page_size=10`, [payment1Mock]).as('getStudent')
    cy.intercept('GET', `/students/${student1Mock.id}/fees/${feelsMock[7 - 1].id}`, feelsMock[7 - 1]).as('getFee')
    cy.intercept('GET', `/whoami`, whoamiStudentMock).as('getWhoami')
    cy.get(`[href="#/students/${student1Mock.id}/fees"]`).click()
    cy.get('body').click(200, 0) //note(uncover-menu)
    cy.get(':nth-child(7) > :nth-child(5)').click()
    cy.contains('En retard')
  })
})
