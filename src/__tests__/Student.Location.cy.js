import { mount } from '@cypress/react'
import App from '../App'
import { student1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import { student1Mock, whoamiStudentMock } from './mocks/responses'

describe(specTitle('Student Location'), () => {
    beforeEach(() => {
        cy.intercept('GET', `/whoami`, whoamiStudentMock).as('whoami')
    })

    it('Should show student profile with empty location', () => {
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
        cy.contains('Localisation GPS')
        cy.contains('Non renseigné')
    })

    it.only('Should show location on student profile', () => {
        cy.intercept('GET', `/students/${student1Mock.id}`, {
            ...student1Mock, location: {
                longitude: '47.5353501',
                latitude: '-18.8705889'
            }
        }).as('getStudent1')
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
        cy.contains('Localisation GPS')
        cy.contains('Longitude: 47.5353501')
        cy.contains('Latitude: -18.8705889')
    })
})