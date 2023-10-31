import { mount } from '@cypress/react'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import App from '../App'
import { teacher1 } from './credentials'
import { studentsMock, teacher1Mock, whoamiTeacherMock } from './mocks/responses'
import { group1Students, groups } from './mocks/responses/groups-api'

const group1 = groups[0]

describe(specTitle('Manager'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.intercept('GET', `/whoami`, whoamiTeacherMock).as('getWhoami')
    cy.intercept('GET', `/teachers/${teacher1Mock.id}`, teacher1Mock).as('getTeacher1')

    cy.intercept('GET', `/groups?page=1&page_size=10`, groups).as('getGroups')
    cy.intercept('GET', `/students?page=1&page_size=25`, studentsMock).as('getStudents')
    cy.intercept('GET', `/groups/${group1.id}`, group1).as('getGroup1')
    cy.intercept('GET', `/groups/${group1.id}/students?page=1&page_size=10`, group1Students).as('getGroupStudents')

    cy.get('#username').type(teacher1.username)
    cy.get('#password').type(teacher1.password)
    cy.get('button').contains('Connexion').click()
    cy.wait('@getWhoami')
    cy.wait('@getTeacher1')

    cy.get("[data-testid='groups']").click()
  })

  it('can view groups list', () => {
    cy.contains('Liste de groupes')
    cy.contains('Référence')
    cy.contains('Nom')
    cy.contains('Année de création')
  })
  it('can view a group detail', () => {
    cy.contains('Ajouter un filtre').click()
    cy.get('[data-key="ref"]').click()
    cy.get('#ref').type(group1.ref)
    cy.contains(`Afficher`).click()
    cy.contains('Référence')
    cy.contains('Nom')
    cy.contains('Date de création')
    cy.contains('Les étudiants dans ce groupe')
  })
})
