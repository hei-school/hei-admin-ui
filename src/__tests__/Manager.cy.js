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
  createFeeWithManualDataMock,
  createStudent,
  createdFeesForNewStudent
} from './mocks/responses'

const feeDateToSearch = `2022-09-11`
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
  })

  it('lands on profile page if succeeds', () => {
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
    cy.contains(`Taille : ${studentsMock.length}`)

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
    cy.get('body').click(200, 0) //note(uncover-menu)
    cy.contains('Page : 1')
    cy.contains(`Taille : ${studentsMock.length}`)

    cy.get('button').contains('Suivant').click()
    cy.contains('Page : 2')

    cy.get('#first_name').type(teacherNameToBeCheckedMock)
    cy.wait('@getTeacherByName')
    cy.get('#main-content table').contains(teacherNameToBeCheckedMock)
    cy.contains('Page : 1')
    unmount()
  })

  it('can edit students', () => {
    cy.intercept('GET', `/students/${student1Mock.id}`, student1Mock)
    cy.intercept('PUT', `/students`, updatedStudent).as('modifyStudent').as('modifyStudent')
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
    cy.contains(studentNameToBeCheckedMock).click()
    cy.get('.css-1hqp8sg-MuiButtonBase-root-MuiButton-root-RaButton-root').click() //éditer
    cy.get('#first_name').click().clear().type(newLastname)
    cy.intercept('GET', `/students?page=1&page_size=10&last_name=${studentNameToBeCheckedMock}`, [updatedStudent]).as('getUpdatedStudent')
    cy.contains('Enregistrer').click()
    cy.wait('@modifyStudent')
    cy.wait('@getUpdatedStudent')
    cy.contains(newLastname)
  })
})

describe(specTitle('Manager creates students'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').type(manager1.username)
    cy.get('#password').type(manager1.password)
    cy.get('button').contains('Connexion').click()

    cy.intercept('GET', `/whoami`, whoamiManagerMock).as('getWhoami')
    cy.intercept('GET', `/managers/${manager1Mock.id}`, manager1Mock).as('getManager1')
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
    cy.wait('@getWhoami')
    cy.contains('Mon profil')
    cy.wait('@getWhoami')
    cy.get(':nth-child(1) > .MuiListItem-root').click()
    cy.get(':nth-child(3) > .MuiListItem-root').click() // Étudiants category

    cy.get('[href="#/students"]').click()
    cy.get('body').click(200, 0) //note(uncover-menu)
    cy.contains('Page : 1')
    cy.contains(`Taille : ${studentsMock.length}`)
    cy.get('.MuiFab-root').click()

    cy.intercept('PUT', '/students', [createdStudent]).as('createStudent')
    cy.intercept('POST', `students/${createdStudent.id}/fees`, [createdFeesForNewStudent])
    cy.get('#ref').type(createStudent.ref)
    cy.get('#first_name').type(createStudent.first_name)
    cy.get('#last_name').type(createStudent.last_name)
    cy.get('#sex_F').click()
    cy.get('#phone').type(createStudent.phone)
    cy.get('#birth_date').click().type(createStudent.birth_date)
    cy.get('.ra-input-address > .MuiInputBase-root').type(createStudent.address)
    cy.get('#email').type(createStudent.email)
    cy.get('#entrance_datetime').click().type(createStudent.entrance_datetime)
  })
  it('can create students without fees', () => {
    cy.intercept('GET', '/students?page=1&page_size=10', [createdStudent, ...studentsMock].slice(0, 10)).as('getStudents')
    cy.contains('Enregistrer').click()
  })
  it('can create student with his/her fees using predefined fees', () => {
    cy.get('.MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click()
    cy.get('#predefined_type').click()
    cy.get('.MuiList-root > [tabindex="0"]').click()
    cy.get('#predefined_first_dueDate').click()
    cy.get('[data-value="date2"]').click()
    cy.intercept('GET', '/students?page=1&page_size=10', [...studentsMock, createdStudent].slice(0, 10)).as('getStudents')
    cy.contains('Enregistrer').click()
  })

  it('can create student with his/her 9 months fees', () => {
    cy.get('.MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click()
    cy.get('#predefined_type').click()
    cy.get('[data-value="annualTuition9x"]').click()
    cy.get('#predefined_first_dueDate').click()
    cy.get('[data-value="date2"]').click()
    cy.intercept('GET', '/students?page=1&page_size=10', [...studentsMock, createdStudent].slice(0, 10)).as('getStudents')
    cy.contains('Enregistrer').click()
  })

  it('can create student with his/her fees manually', () => {
    cy.get('.MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click()
    const monthlyAmount = 1 + Math.floor(Math.random() * 2_000_000)
    const monthsNumber = 1 + Math.floor(Math.random() * 3)
    const comment = 'Dummy comment'
    const createdFeesWithStudent = createFeeWithManualDataMock(feeDateToSearch, monthlyAmount, comment, monthsNumber)
    cy.intercept('POST', `/students/${createdStudent.id}/fees`, createdFeesWithStudent)
    cy.get('#is_predefined_type').click()
    cy.get('#manual_type_tuition').click()
    cy.get('#monthly_amount').click().type(monthlyAmount)

    cy.get('#months_number').click().type(monthsNumber)

    cy.get('#comment').click().type(comment)

    cy.get('#is_predefined_first_dueDate').click()
    cy.get('#manual_first_duedate').click().type(feeDateToSearch)

    cy.intercept('GET', `/students/${createStudent.id}/fees?page=1&page_size=500`, createdFeesWithStudent).as('getFees')
    cy.contains('Enregistrer').click()
    cy.contains('Élément créé')
  })
})
