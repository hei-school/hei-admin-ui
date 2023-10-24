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
  teacherNameToBeCheckedMock,
  teacher1Mock,
  teachersMock,
  whoamiManagerMock,
  createStudent
} from './mocks/responses'

const newLastname = 'Aina herilala'
let createdStudent = {
  ...createStudent
}
createdStudent.id = 'ajbfq-fqdfjdh-2jkg3j'
let updatedStudent = {
  ...student1Mock
}
updatedStudent.first_name = newLastname

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
    cy.intercept('GET', `/teachers?page=1&page_size=10&first_name=${teacherNameToBeCheckedMock}`, [teacher1Mock]).as('getTeacherByName')

    cy.wait('@getWhoami')
  })

  it('lands on profile page if succeeds', () => {
    cy.get('[href="#/profile"]').click()
    cy.get('#first_name').contains(managerNameToBeCheckedMock)
    cy.get('#main-content')
      .should('contain', manager1Mock.ref)
      .and('contain', manager1Mock.last_name)
      .and('contain', manager1Mock.address)
      .and('contain', manager1Mock.email)
      .and('contain', manager1Mock.phone)
    unmount()
  })

  it('can list and filter students', () => {
    cy.contains('Enseignants')
    cy.contains('Étudiants')
    cy.contains('Mon profil')

    cy.get('[data-testid="students-menu"]').click() // Étudiants category
    cy.get('[href="#/students"]').click()
    cy.contains('Page : 1')
    cy.contains(`Taille : ${studentsMock.length}`)
    cy.get('td input[type="checkbox"]', { timeout: 50 }).should('not.exist')

    cy.get('button').contains('Suivant').click()
    cy.contains('Page : 2')

    cy.get('[data-testid="FilterListIcon"]').click()
    cy.get('[data-key="last_name"]').click()
    cy.get('#last_name').type(studentNameToBeCheckedMock)
    cy.wait('@getStudentsByName')
    cy.get('#main-content table').contains(studentNameToBeCheckedMock)
    cy.contains('Page : 1')
    unmount()
  })

  it('can list and filter teachers', () => {
    cy.get('[href="#/teachers"]').click() //Enseignants menu
    cy.contains('Page : 1')
    cy.contains(`Taille : ${studentsMock.length}`)
    cy.get('td input[type="checkbox"]', { timeout: 50 }).should('not.exist')

    cy.get('button').contains('Suivant').click()
    cy.contains('Page : 2')

    cy.get('#first_name').type(teacherNameToBeCheckedMock)
    cy.wait('@getTeacherByName')
    cy.get('#main-content table').contains(teacherNameToBeCheckedMock)
    cy.contains('Page : 1')
    unmount()
  })
})
