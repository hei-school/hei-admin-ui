import { mount } from '@cypress/react'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import App from '../App'
import '../../cypress/support/commands'
import {
  course1exams,
  course1Mock,
  courseCreatedMock,
  coursesMock,
  createExam,
  exam1,
  exam1Details,
  exam2,
  exam2Details,
  manager1Mock,
  updatedExam,
  updatedExamDetails,
  whoamiManagerMock
} from './mocks/responses'
import { WhoamiRoleEnum } from '../gen/haClient'

describe(specTitle('Manager.Exam'), () => {
  beforeEach(() => {
    mount(<App />)

    cy.intercept('GET', `/managers/${manager1Mock.id}`, manager1Mock).as('getManager1')

    cy.cognitoLogin(WhoamiRoleEnum.Manager)

    cy.intercept('GET', `/courses?page=1&page_size=10`, coursesMock).as('getCourses')
    cy.intercept('GET', `/courses/${courseCreatedMock.id}`, courseCreatedMock).as('getCourseCreated')
    cy.intercept('GET', `/courses/${course1Mock.id}/exams`, course1exams).as('getcourse1exams')
    cy.intercept('GET', `/courses/${course1Mock.id}`, course1Mock).as('getCourse1')
    cy.get('.RaMultiLevelMenu-navWithCategories').contains('Cours').click()
    cy.wait('@getCourses')
  })

  it('can list exams', () => {
    cy.get('.MuiTableBody-root > :nth-child(1) > .column-code').click()
    cy.get('.MuiTableHead-root > .MuiTableRow-root').should('contain', 'Détails').and('contain', 'Date').and('contain', 'Coefficient')
  })

  it('can create an exam', () => {
    const title = 'exam title 2'
    const coefficient = 2
    const examination_date = '2023-08-17'
    const toCreateExam = createExam(title, coefficient, examination_date)
    const createdExam = [{ id: 'new_exam_id', ...toCreateExam }]

    cy.get('.MuiTableBody-root > :nth-child(1) > .column-code').click()
    cy.get('.MuiToolbar-gutters > .MuiToolbar-root > .MuiButtonBase-root').click() // add exam
    cy.get('#title').clear().type(title)
    cy.get('#coefficient').clear().type(coefficient)
    cy.get('#examination_date').clear().type(examination_date)

    cy.intercept('PUT', `/courses/${course1Mock.id}/exams`, createdExam).as('createExam')
    cy.intercept('GET', `/courses/${course1Mock.id}/exams`, [...createdExam, ...course1exams]).as('getcourse1exams')

    cy.contains('Enregistrer').click()
    cy.contains('Élément créé')
    cy.contains(title)
  })

  it('can detail the current exam', () => {
    cy.intercept('GET', `/whoami`, whoamiManagerMock).as('getWhoami')
    cy.intercept('GET', `/courses/${course1Mock.id}/exams/${exam1.id}`, exam1).as('getOneExam')
    cy.intercept('GET', `/courses/${course1Mock.id}/exams/${exam1.id}/details`, exam1Details).as('getExamDetails')

    cy.get('.MuiTableBody-root > :nth-child(1) > .column-code').click()
    cy.get(':nth-child(1) > .column-title > .MuiTypography-root').click()
    cy.wait('@getExamDetails')
    cy.get('.ra-field-title').contains('Nom/Titre')
    cy.get('.ra-field-examination_date').contains('Date')
    cy.get('.ra-field-coefficient').contains('Coefficient')
    cy.get('.MuiTableHead-root > .MuiTableRow-root > .column-ref').contains('Identifiant')
    cy.get('.MuiTableHead-root > .MuiTableRow-root > .column-email').contains('Email')
  })
  it('can get a void participants list', () => {
    cy.intercept('GET', `/whoami`, whoamiManagerMock).as('getWhoami')
    cy.intercept('GET', `/courses/${course1Mock.id}/exams/${exam2.id}`, exam2).as('getExamTwo')
    cy.intercept('GET', `/courses/${course1Mock.id}/exams/${exam2.id}/details`, exam2Details).as('getExamDetails')
    cy.intercept('GET', `/courses/${course1Mock.id}--${exam2.id}/exams/${exam2.id}`, exam2)
    cy.intercept('GET', `/courses/${course1Mock.id}--${exam2.id}/exams/${exam2.id}/details`, exam2Details)

    cy.get('.MuiTableBody-root > :nth-child(1) > .column-code').click()
    cy.get(':nth-child(2) > .column-title > .MuiTypography-root').click()
    cy.wait('@getExamDetails')
    cy.contains('Participants')
  })

  it('can edit the exam details', () => {
    cy.intercept('GET', `/whoami`, whoamiManagerMock).as('getWhoami')
    cy.intercept('GET', `/courses/${course1Mock.id}--${exam1.id}/exams/${exam1.id}`, exam1).as('getOneExam')
    cy.intercept('GET', `/courses/${course1Mock.id}/exams/${exam1.id}/details`, exam1Details).as('getExamDetails')

    cy.get('.MuiTableBody-root > :nth-child(1) > .column-code').click()
    cy.get(':nth-child(1) > .column-title > .MuiTypography-root').click()
    cy.wait('@getExamDetails')
    cy.get('#main-content').contains('Éditer').click()
    cy.get('#title').clear().type(updatedExam.title)
    cy.get('#coefficient').clear().type(updatedExam.coefficient)

    cy.intercept('GET', `/courses/${course1Mock.id}--${exam1.id}/exams/${exam1.id}`, updatedExam).as('getUpdatedExam2')
    cy.intercept('GET', `/courses/${course1Mock.id}/exams/${exam1.id}/details`, updatedExamDetails).as('getUpdatedExam1')
    cy.intercept('GET', `/courses/${course1Mock.id}--${exam1.id}/exams/${exam1.id}/details`, updatedExamDetails).as('getUpdatedExamDetails')
    cy.intercept('PUT', `/courses/${course1Mock.id}--${exam1.id}/exams`, [updatedExam]).as('getUpdatedExamDetails')

    cy.get('button').contains('Enregistrer').click()

    cy.contains('Élément mis à jour')
    cy.contains(updatedExam.title)
  })
})
