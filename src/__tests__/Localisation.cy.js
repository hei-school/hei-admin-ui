import { mount } from '@cypress/react'
import App from '../App'
import { student1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import { student1Mock,student1MockWithoutLocation, studentNameToBeCheckedMock, whoamiStudentMock } from './mocks/responses'

describe(specTitle('Student'), () => {
    beforeEach(() => {
      mount(<App />)
      cy.get('#username').type(student1.username)
      cy.get('#password').type(student1.password)
      cy.get('button').contains('Connexion').click()
      cy.intercept('GET', `/whoami`, whoamiStudentMock).as('getWhoami')
    })
    it('lands on profile page if succeeds', () => {
        cy.get('#first_name').contains(studentNameToBeCheckedMock)
      })
    it('shows location if there is location', () => {
        cy.get('#location').contains('Longitude: ' + student1Mock.location.longitude)
        cy.get('#location').contains('Latitude: ' + student1Mock.location.latitude)
      })
    it('shows alternative value if there is no location', () => {
        cy.intercept('GET', `/students/${student1Mock.id}`, student1MockWithoutLocation).as('getStudent')
        cy.get('#location').contains('Aucune carte n\'est disponible pour cette adresse !')
      })    
})