import { mount } from '@cypress/react'
import App from '../App'
import { student1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'

describe(specTitle('Authentication'), () => {
  it('remains on login page if fails', () => {
    mount(<App />)

    cy.get('button').contains('Connexion').click()
    cy.get('#username-helper-text').contains('Ce champ est requis')

    cy.get('#username').type(student1.username)
    cy.get('#password').type('bad password')
    cy.get('button').contains('Connexion').click()
    cy.contains('Incorrect username or password.')
  })
  it('permits user to renew password when it is forgotten', () => {
    mount(<App />)
    cy.intercept('POST', 'https://cognito-idp.eu-west-3.amazonaws.com/', req => {
      req.reply({
        CodeDeliveryDetails: {
          AttributeName: 'email',
          DeliveryMedium: 'EMAIL',
          Destination: student1.username
        }
      })
    }).as('awsrequest')
    cy.contains('Mot de passe oublié?').click()
    cy.get('[data-testid="mail_input"]').type(student1.username)
    cy.contains('ENVOYER').click()
    cy.wait('@awsrequest')
    cy.get('[data-testid="code_input"]').type(12345678)
    cy.get('[data-testid="password_input"]').type(student1?.password?.concat('&'))
    cy.get('[data-testid="confirm_password_input"]').type(student1?.password?.concat('&'))
    cy.contains('RÉINITIALISER').click()
  })
})
