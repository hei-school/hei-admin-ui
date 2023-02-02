import { mount, unmount } from '@cypress/react'
import App from '../App'
import { manager1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import {
  manager1Mock,
  managerNameToBeCheckedMock,
  student1Mock,
  studentNameToBeCheckedMock,
  studentsMock,
  TaecherNameToBeCheckedMock,
  teacher1Mock,
  teachersMock,
  whoamiManagerMock
} from './mocks/responses'

describe(specTitle('Manager'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').type(manager1.username)
    cy.get('#password').type(manager1.password)
    cy.get('button').contains('Connexion').click()

    cy.intercept('GET', `/whoami`, whoamiManagerMock).as('getWhoami')
    cy.intercept('GET', `/managers/${manager1Mock.id}`, manager1Mock).as('getManager1')
    cy.intercept('GET', `/students?page=1&page_size=10`, studentsMock).as('getStudentsPage1')
    cy.intercept('GET', `/students?page=2&page_size=10`, studentsMock).as('getStudentsPage2')
    cy.intercept('GET', `/students?page=1&page_size=10&last_name=${studentNameToBeCheckedMock}`, [student1Mock]).as('getStudentsByName')
    cy.intercept('GET', `/teachers?page=1&page_size=10`, teachersMock).as('getTeachersPage1')
    cy.intercept('GET', `/teachers?page=2&page_size=10`, teachersMock).as('getTeachersPage2')
    cy.intercept('GET', `/teachers?page=1&page_size=10&first_name=${TaecherNameToBeCheckedMock}`, [teacher1Mock]).as('getTeacherByName')
  })

  it('lands on profile page if succeeds', () => {
    cy.get('#first_name').contains(managerNameToBeCheckedMock)
    unmount()
  })

  it('can list and filter students', () => {
    cy.wait('@getManager1')
    cy.contains('Enseignants')
    cy.wait('@getWhoami')
    cy.contains('Étudiants')
    cy.wait('@getWhoami')
    cy.contains('Mon profil')
    cy.wait('@getWhoami')
    cy.get(':nth-child(1) > .MuiListItem-root').click()
    cy.get(':nth-child(3) > .MuiListItem-root').click() // Étudiants category

    cy.get('[href="#/students"]').click()
    cy.get('body').click(200, 0) //note(uncover-menu)
    cy.contains('Page : 1')
    cy.contains('Taille : 10')

    cy.get('button').contains('Suivant').click()
    cy.contains('Page : 2')

    cy.get('[data-testid="FilterListIcon"]').click()
    cy.get('[data-key="last_name"]').click()
    cy.get('#last_name').type(studentNameToBeCheckedMock)
    cy.contains('Page : 1')
    cy.contains('Taille : 1')
    unmount()
  })

  it('can list and filter teachers', () => {
    cy.get('[href="#/teachers"]').click() // Enseignants menu
    cy.get('body').click(200, 0) //note(uncover-menu)
    cy.contains('Page : 1')
    cy.contains('Taille : 10')

    cy.get('button').contains('Suivant').click()
    cy.contains('Page : 2')

    cy.get('#first_name').type(TaecherNameToBeCheckedMock)
    cy.contains('Page : 1')
    cy.contains('Taille : 1')
    unmount()
  })
})
