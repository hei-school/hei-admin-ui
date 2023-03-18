import { mount } from '@cypress/react'
import App from '../App'
import { student1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import { createPaymentMock, feesMock, student1Mock, studentNameToBeCheckedMock, whoamiStudentMock } from './mocks/responses'

describe(specTitle('Student'), () => {
    it('affiche la latitude correcte si elle est définie', () => {
        cy.intercept('GET', '/profile', { fixture: 'profile_with_latitude.json' }) 
        cy.relo
        cy.get('[data-testid="latitude"]').should('have.text', '48.8534'
      }),
    
      it('affiche la longitude correcte si elle est définie', () => {
        cy.intercept('GET', '/profile', { fixture: 'profile_with_longitude.json' })
        cy.reload()
        cy.get('[data-testid="longitude"]').should('have.text', '2.3488')
      })

  
})