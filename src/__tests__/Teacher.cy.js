import { mount, unmount } from '@cypress/react'
import App from '../App'
import { teacher1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import { teacher1Mock, whoamiTeacherMock, student1Mock, studentsMock, studentNameToBeCheckedMock, teacherNameToBeCheckedMock } from './mocks/responses'

describe(specTitle('Teacher'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.intercept('GET', `/whoami`, whoamiTeacherMock).as('getWhoami')
    cy.intercept('GET', `/teachers/${teacher1Mock.id}`, teacher1Mock).as('getTeacher1')
    cy.get('#username').type(teacher1.username)
    cy.get('#password').type(teacher1.password)
    cy.get('button').contains('Connexion').click()
    cy.wait('@getWhoami')
    cy.wait('@getTeacher1')
  })

  it('lands on profile page if succeeds', () => {
    cy.get('#first_name').contains(teacherNameToBeCheckedMock)
    cy.get('#ha-menu').should('not.contain', 'Enseignants', { timeout: 50 }).and('contain', 'Étudiants')
    cy.get('#main-content')
      .should('contain', teacher1Mock.ref)
      .and('contain', teacher1Mock.last_name)
      .and('contain', teacher1Mock.address)
      .and('contain', teacher1Mock.email)
      .and('contain', teacher1Mock.phone)
    cy.get('a[href="#/profile"]').click()
    //cy.get('.RaBreadcrumb-list').should('not.contain', 'ÉDITER', { timeout: 50 }).and('not.contain', 'CRÉER', { timeout: 50 })
    unmount()
  })

  it('can check one student', () => {
    cy.intercept('GET', `/students?page=1&page_size=10`, studentsMock).as('getStudents')
    cy.intercept('GET', `/students/${student1Mock.id}`, student1Mock).as('getStudent1')
    cy.get('a[href="#/students"]').click() // Étudiants menu
    cy.wait('@getStudents')
    cy.get('body').click(200, 0) //note(uncover-menu)
    cy.contains(student1Mock.first_name).click()
    cy.wait('@getStudent1')
    cy.get('#main-content')
      .should('contain', student1Mock.ref)
      .and('contain', student1Mock.first_name)
      .and('contain', student1Mock.last_name)
      .and('contain', student1Mock.address)
      .and('contain', student1Mock.email)
      .and('contain', student1Mock.phone)
      .and('not.contain', 'CRÉER')
      .and('not.contain', 'ÉDITER')
    unmount()
  })

  it('can list and filter students', () => {
    cy.intercept('GET', `/students?page=1&page_size=10`, studentsMock).as('getStudentsPage1')
    cy.intercept('GET', `/students?page=2&page_size=10`, studentsMock).as('getStudentsPage2')
    cy.intercept('GET', `/students?page=1&page_size=10&last_name=${studentNameToBeCheckedMock}`, [student1Mock]).as('getStudentByName')
    // note(listAndFilterStudents)
    cy.get('a[href="#/students"]').click() // Étudiants menu
    cy.wait('@getStudentsPage1')
    cy.get('body').click(200, 0) //note(uncover-menu)
    cy.contains('Page : 1')
    cy.contains(`Taille : ${studentsMock.length}`)
    cy.get('td input[type="checkbox"]', { timeout: 50 }).should('not.exist')
    cy.get('td a').should('not.contain', 'ÉDITER', { timeout: 50 })
    cy.get('.RaList-main>').should('not.contain', 'CRÉER', { timeout: 50 })

    cy.get('button').contains('Suivant').click()
    cy.wait('@getStudentsPage2')
    cy.contains('Page : 2')

    cy.get('[data-testid="FilterListIcon"]').click()
    cy.get('[data-key="last_name"]').click()
    cy.get('#last_name').type(studentNameToBeCheckedMock)
    cy.contains('Page : 1')
    unmount()
  })
})
