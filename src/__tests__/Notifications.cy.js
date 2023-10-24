import { mount, unmount } from '@cypress/react'
import App from '../App'
import { manager1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import {
  manager1Mock,
  student1Mock,
  studentNameToBeCheckedMock,
  studentsMock,
  teacherNameToBeCheckedMock,
  teacher1Mock,
  teachersMock,
  whoamiManagerMock,
  createFeeWithManualDataMock,
  createStudent,
  createdFeesForNewStudent
} from './mocks/responses'
import { updatedInfo } from './utils'

let createdStudent = {
  ...createStudent,
  id: 'ajbfq-fqdfjdh-2jkg3j'
}
describe(specTitle('Notifications on error when create, e.g: StudentCreate'), () => {
  it('notifies when there is error', () => {
    mount(<App />)
    cy.get('#username').type(manager1.username)
    cy.get('#password').type(manager1.password)
    cy.get('button').contains('Connexion').click()

    cy.intercept('GET', `/whoami`, whoamiManagerMock).as('getWhoami')
    cy.intercept('GET', `/managers/${manager1Mock.id}`, req => {
      req.reply(res => {
        res.setDelay(400)
        res.send(manager1Mock)
      })
    }).as('getManager1')
    cy.intercept('GET', `/students?page=1&page_size=10`, studentsMock).as('getStudentsPage1')
    cy.intercept('GET', `/students?page=2&page_size=10`, studentsMock).as('getStudentsPage2')
    cy.intercept('GET', `students/${createdStudent.id}`, createdStudent).as('getStudent')
    cy.intercept('GET', `/students?page=1&page_size=10&last_name=${studentNameToBeCheckedMock}`, [student1Mock]).as('getStudentsByName')
    cy.intercept('GET', `/teachers?page=1&page_size=10`, teachersMock).as('getTeachersPage1')
    cy.intercept('GET', `/teachers?page=2&page_size=10`, teachersMock).as('getTeachersPage2')
    cy.intercept('GET', `/teachers?page=1&page_size=10&first_name=${teacherNameToBeCheckedMock}`, [teacher1Mock]).as('getTeacherByName')

    cy.contains('Enseignants')
    cy.wait('@getWhoami')
    cy.contains('Étudiants')

    cy.get('[data-testid="students-menu"]').click() // Étudiants category

    cy.get('[href="#/students"]').click()
    cy.contains('Page : 1')
    cy.contains(`Taille : ${studentsMock.length}`)
    cy.get('.MuiFab-root').click()
    cy.get('#ref').type(createStudent.ref)
    cy.get('#first_name').type(createStudent.first_name)
    cy.get('#last_name').type(createStudent.last_name)
    cy.get('#sex_F').click()
    cy.get('#phone').type(createStudent.phone)
    cy.get('#birth_date').click().type(createStudent.birth_date)
    cy.get('.ra-input-address > .MuiInputBase-root').type(createStudent.address)
    cy.get('#email').type(createStudent.email)
    cy.get('#entrance_datetime').click().type(createStudent.entrance_datetime.slice(0, 10))
    cy.intercept('PUT', '/students', {
      statusCode: 500,
      body: {
        message: 'error'
      }
    }).as('createStudent')
    cy.contains('Enregistrer').click()
    cy.contains("Une erreur s'est produite")
    unmount()
  })
})
describe(specTitle('Notifications on error when edit, e.g: TeacherEdit'), () => {
  it('notifies when there is error', () => {
    mount(<App />)
    cy.get('#username').type(manager1.username)
    cy.get('#password').type(manager1.password)
    cy.get('button').contains('Connexion').click()
    cy.intercept('GET', '/whoami', whoamiManagerMock).as('getWhoami')
    cy.intercept('GET', `/managers/${manager1Mock.id}`, manager1Mock).as('getManager')
    cy.intercept('GET', '/teachers?page=1&page_size=10', teachersMock).as('getTeachers')
    cy.intercept('GET', /teachers\?page=1&page_size=10&(first_name|ref|last_name)=/, [teacher1Mock]).as('getFilters')
    cy.intercept('GET', `/teachers/${teachersMock[0].id}`, teachersMock[0]).as('getTeachers1')

    cy.wait('@getWhoami')
    cy.get('[href="#/teachers"]').click()
    cy.get(':nth-child(1) > .column-undefined > .MuiButtonBase-root').as('editButton')
    cy.get('.css-t6tio9-RaFilterButton-root > .MuiButtonBase-root').as('add-filter-button')
    cy.get('@editButton').click()
    cy.wait('@getTeachers1')
    cy.intercept('PUT', '/teachers', {
      statusCode: 500,
      body: {
        message: 'error'
      }
    }).as('createTeacher')
    cy.get('#last_name').clear().type(updatedInfo.last_name)
    cy.get('[data-testid="SaveIcon"]').click()
    cy.contains("Une erreur s'est produite")
    unmount()
  })
})
