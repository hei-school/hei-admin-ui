import { mount } from '@cypress/react'
import App from '../App'
import { student1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import { student1Mock, whoamiStudentMock } from './mocks/responses'

describe(specTitle('Check Student Location'), () => {
  beforeEach(() => {
    cy.intercept('GET', `/whoami`, whoamiStudentMock).as('whoami')
  })

  it('Should detects latitude and longitude on student profile', () => {
    cy.intercept('GET', `/students/${student1Mock.id}`, student1Mock).as('getStudent')
    mount(<App />)

    cy.get('#username').type(student1.username)
    cy.get('#password').type(`${student1.password}{enter}`)

    cy.contains('Référence')
    cy.contains('STD21111')
    cy.contains('Nom(s)')
    cy.contains('Rafanomezantsoa')
    cy.contains('Sexe')
    cy.contains('Homme')
    cy.contains('Téléphone')
    cy.contains('0322411123')
    cy.contains('Date de naissance')
    cy.contains('1 janvier 2000')
    cy.contains('Adresse')
    cy.contains('Adr 1')
    cy.contains('Coordonnées géographiques')
    cy.contains('longitude: 47.5353501')
    cy.contains('latitude: -20,6232')
    cy.contains('Voir sur la carte')
  })

  it('Should not show student profile', () => {
    cy.intercept('GET', `/students/${student1Mock.id}`, { ...student1Mock, location: null }).as('getStudent')
    mount(<App />)

    cy.get('#username').type(student1.username)
    cy.get('#password').type(`${student1.password}{enter}`)

    cy.contains('Référence')
    cy.contains('STD21111')
    cy.contains('Nom(s)')
    cy.contains('Rafanomezantsoa')
    cy.contains('Sexe')
    cy.contains('Homme')
    cy.contains('Téléphone')
    cy.contains('0322411123')
    cy.contains('Date de naissance')
    cy.contains('1 janvier 2000')
    cy.contains('Adresse')
    cy.contains('Adr 1')
    cy.contains('Coordonnées géographiques')
    cy.contains('Les coordonnées géographique de cet étudiant ne sont pas encore renseigner.')
  })
})

