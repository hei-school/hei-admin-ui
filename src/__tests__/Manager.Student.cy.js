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
  createdFeesForNewStudent,
  liteCreatedStudent
} from './mocks/responses'
import { manualFeeTypes, predefinedFeeTypes, predefinedFirstDueDates } from '../conf'
import { TurnsStringIntoDate } from '../operations/utils'
import { studentRequestBodyVerification } from './utils'

const feeDateToSearch = `2022-09-11`
const newFirstName = 'Aina herilala'
let createdStudent = {
  ...createStudent,
  id: 'ajbfq-fqdfjdh-2jkg3j'
}
const feeCreatDate = 'date2'
let updatedStudent = {
  ...student1Mock,
  first_name: newFirstName
}

const fillInputs = () => {
  cy.get('#sex_F').click()
  cy.get('#phone').type(createStudent.phone)
  cy.get('#birth_date').click().type(createStudent.birth_date)
  cy.get("[data-testid='addressInput']").type(createStudent.address)
}
describe(specTitle('Manager edit students'), () => {
  beforeEach(() => {
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
    cy.intercept('GET', `/students?page=1&page_size=10&last_name=${studentNameToBeCheckedMock}`, [student1Mock]).as('getStudentsByName')
    cy.intercept('GET', `/teachers?page=1&page_size=10`, teachersMock).as('getTeachersPage1')
    cy.intercept('GET', `/teachers?page=2&page_size=10`, teachersMock).as('getTeachersPage2')
    cy.intercept('GET', `/teachers?page=1&page_size=10&first_name=${teacherNameToBeCheckedMock}`, [teacher1Mock]).as('getTeacherByName')
  })

  it('can edit students', () => {
    cy.intercept('GET', `/students/${student1Mock.id}`, student1Mock)
    cy.intercept('PUT', `/students`, [updatedStudent]).as('modifyStudent')
    cy.contains('Étudiants')
    cy.wait('@getWhoami')
    cy.contains('Mon profil')
    cy.wait('@getManager1')
    cy.wait('@getWhoami')
    cy.get('[data-testid="students-menu"]').click() // Étudiants category

    cy.get('[href="#/students"]').click()
    cy.get('body').click(200, 0) //note(uncover-menu)
    cy.contains('Page : 1')
    cy.contains(`Taille : ${studentsMock.length}`)
    cy.get('button').contains('Suivant').click()
    cy.contains('Page : 2')

    cy.get('[data-testid="FilterListIcon"]').click()
    cy.get('[data-key="last_name"]').click()
    cy.get('#last_name').type(studentNameToBeCheckedMock)
    cy.contains('Page : 1')
    cy.contains('Taille : 1')
    cy.contains(studentNameToBeCheckedMock).click()
    cy.get('a[aria-label="Éditer"]').click() //éditer
    cy.get('#first_name').click().clear().type(newFirstName)
    cy.intercept('GET', `/students?page=1&page_size=10&last_name=${studentNameToBeCheckedMock}`, [updatedStudent]).as('getUpdatedStudent')
    cy.contains('Enregistrer').click()
    cy.wait('@modifyStudent').then(requestIntersection => {
      let modifyStudentWithoutFeesBodyMock = requestIntersection.request.body[0]
      modifyStudentWithoutFeesBodyMock.first_name = newFirstName
      expect(requestIntersection.request.body[0]).to.deep.equal(modifyStudentWithoutFeesBodyMock)
      expect(requestIntersection.request.body.length).to.equal(1)
    })
    cy.wait('@getUpdatedStudent')
    cy.contains(newFirstName)
    unmount()
  })
})

describe(specTitle('Manager creates students'), () => {
  beforeEach(() => {
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

    cy.wait('@getManager1')
    cy.get('[data-testid="students-menu"]').click() // Étudiants category

    cy.get('[href="#/students"]').click()
    cy.get('body').click(200, 0) //note(uncover-menu)
    cy.contains('Page : 1')
    cy.contains(`Taille : ${studentsMock.length}`)
    cy.get('[href="#/students/create"]').click()
    cy.intercept('PUT', '/students', [createdStudent]).as('createStudent')
    cy.intercept('POST', `students/${createdStudent.id}/fees`, [createdFeesForNewStudent]).as('createFees')
    cy.get('#ref').type(createStudent.ref)
    cy.get('#first_name').type(createStudent.first_name)
    cy.get('#last_name').type(createStudent.last_name)
    cy.get('#entrance_datetime').click().type(createStudent.entrance_datetime.slice(0, 10))
    cy.get('#email').type(createStudent.email)
  })
  it('can create students without fees', () => {
    cy.intercept('GET', '/students?page=1&page_size=10', [createdStudent, ...studentsMock].slice(0, 10)).as('getStudents')
    fillInputs()
    cy.contains('Enregistrer').click()
    cy.wait('@createStudent').then(requestInterseption => studentRequestBodyVerification(requestInterseption.request.body, false, { ...createStudent }))
    cy.contains('Élément créé')
    unmount()
  })

  it('can create students with only ref, firstname, lastname and entranceDatetime', () => {
    cy.intercept('GET', '/students?page=1&page_size=10', [createdStudent, ...studentsMock].slice(0, 10)).as('getStudents')
    cy.contains('Enregistrer').click()
    cy.wait('@createStudent').then(requestInterception => studentRequestBodyVerification(requestInterception.request.body, false, { ...liteCreatedStudent }))
    cy.contains('Élément créé')
    unmount()
  })

  it('can create student with his/her fees using predefined fees', () => {
    const feeTypeMock = 'annualTuition1x' //have to change if the name of predefinedFirstDueDates's properties change
    fillInputs()
    cy.get('.MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click()
    cy.get('#predefined_type').click()
    cy.get(`[data-value="${feeTypeMock}"]`).click()
    cy.get('#predefined_first_dueDate').click()
    cy.get(`[data-value="${feeCreatDate}"]`).click()
    cy.intercept('GET', '/students?page=1&page_size=10', [...studentsMock, createdStudent].slice(0, 10)).as('getStudents')

    cy.contains('Enregistrer').click()
    cy.wait('@createStudent').then(requestInterseption => studentRequestBodyVerification(requestInterseption.request.body, true, { ...createStudent }))
    cy.wait('@createFees').then(requestIntersection => {
      let createAutomaticallyFeesBodyMock = {
        comment: requestIntersection.request.body[0].comment,
        type: predefinedFeeTypes[feeTypeMock][0].type,
        total_amount: Number(predefinedFeeTypes[feeTypeMock][0].monthlyAmount),
        due_datetime: predefinedFirstDueDates[feeCreatDate].value.toISOString()
      }
      expect(requestIntersection.request.body[0]).to.deep.equal(createAutomaticallyFeesBodyMock)
      expect(requestIntersection.request.body.length).to.equal(1)
    })
    cy.contains('Élément créé')
    unmount()
  })

  it('can create student with his/her 9 months fees', () => {
    const feeTypeMock = 'annualTuition9x'
    fillInputs()
    cy.get('.MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click()
    cy.get('#predefined_type').click()
    cy.get(`[data-value="${feeTypeMock}"]`).click()
    cy.get('#predefined_first_dueDate').click()
    cy.get(`[data-value="${feeCreatDate}"]`).click()
    cy.intercept('GET', '/students?page=1&page_size=10', [...studentsMock, createdStudent].slice(0, 10)).as('getStudents')
    cy.intercept('POST', `students/${createdStudent.id}/fees`, [createdFeesForNewStudent]).as('createNineFees')
    cy.contains('Enregistrer').click()
    cy.wait('@createStudent').then(requestInterseption => studentRequestBodyVerification(requestInterseption.request.body, true, { ...createStudent }))
    cy.wait('@createNineFees').then(requestIntersection => {
      let createAutomaticallyFeesBodyMock = {
        comment: requestIntersection.request.body[0].comment,
        type: predefinedFeeTypes[feeTypeMock][0].type,
        total_amount: Number(predefinedFeeTypes[feeTypeMock][0].monthlyAmount),
        due_datetime: predefinedFirstDueDates[feeCreatDate].value.toISOString()
      }
      expect(requestIntersection.request.body[0]).to.deep.equal(createAutomaticallyFeesBodyMock)
      expect(requestIntersection.request.body.length).to.equal(9)
    })
    cy.contains('Élément créé')
    unmount()
  })

  it('can create student with his/her fees manually', () => {
    const feeTypeMock = 'tuition'
    fillInputs()
    cy.get('.MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input').click()
    const monthlyAmount = 1 + Math.floor(Math.random() * 2_000_000)
    const monthsNumber = 1 + Math.floor(Math.random() * 3)
    const comment = 'Dummy comment'
    const createdFeesWithStudent = createFeeWithManualDataMock(feeDateToSearch, monthlyAmount, comment, monthsNumber)
    cy.intercept('POST', `/students/${createdStudent.id}/fees`, createdFeesWithStudent)
    cy.get('#is_predefined_type').click()
    cy.get(`#manual_type_${feeTypeMock}`).click()
    cy.get('#monthly_amount').click().clear().type(monthlyAmount)

    cy.get('#months_number').click().clear().type(monthsNumber)

    cy.get('#comment').click().type(comment)

    cy.get('#is_predefined_first_dueDate').click()
    cy.get('#manual_first_duedate').click().type(feeDateToSearch)

    cy.intercept('GET', `/students/${createStudent.id}/fees?page=1&page_size=500`, createdFeesWithStudent).as('getFees')
    cy.intercept('POST', `students/${createdStudent.id}/fees`, [createdFeesForNewStudent]).as('createFees')
    cy.contains('Enregistrer').click()
    cy.wait('@createStudent').then(requestInterseption => studentRequestBodyVerification(requestInterseption.request.body, true, { ...createStudent }))

    cy.wait('@createFees').then(requestIntersection => {
      let createAutomaticallyFeesBodyMock = {
        total_amount: monthlyAmount.toString(),
        type: manualFeeTypes[feeTypeMock].type,
        due_datetime: TurnsStringIntoDate(feeDateToSearch),
        comment: comment
      }
      expect(requestIntersection.request.body[0]).to.deep.equal(createAutomaticallyFeesBodyMock)
      expect(requestIntersection.request.body.length).to.equal(monthsNumber)
    })

    cy.contains('Élément créé')
    unmount()
  })
})
