import { mount } from '@cypress/react'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import App from '../App'
import { manager1 } from './credentials'
import {
  course1exams,
  course1Mock,
  courseCreatedMock,
  coursesMock,
  exam1,
  exam1Details,
  exam1updatedGrades,
  manager1Mock,
  whoamiManagerMock
} from './mocks/responses'

describe(specTitle('Manager.Grade'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.intercept('GET', `/whoami`, whoamiManagerMock).as('getWhoami')
    cy.intercept('GET', `/managers/${manager1Mock.id}`, manager1Mock).as('getManager1')
    cy.intercept('GET', `/courses?page=1&page_size=10`, coursesMock).as('getCourses')
    cy.intercept('GET', `/courses/${courseCreatedMock.id}`, courseCreatedMock).as('getCourseCreated')
    cy.intercept('GET', `/courses/${course1Mock.id}/exams`, course1exams).as('getcourse1exams')
    cy.intercept('GET', `/courses/${course1Mock.id}`, course1Mock).as('getCourse1')
    cy.get('#username').type(manager1.username)
    cy.get('#password').type(manager1.password)
    cy.get('button').contains('Connexion').click()
    cy.get('.RaMultiLevelMenu-navWithCategories').contains('Cours').click()
    cy.wait('@getCourses')
  })

  it('can edit the grade of a participant', () => {
    const newGrade = {
      student_id: 'student1',
      score: 14
    }
    const targetParticipant = exam1updatedGrades.participants[0]

    cy.intercept('GET', `/whoami`, whoamiManagerMock).as('getWhoami')
    cy.intercept('GET', `/courses/${course1Mock.id}/exams/${exam1.id}`, exam1).as('getOneExam')
    cy.intercept('GET', `/courses/${course1Mock.id}/exams/${exam1.id}/details`, exam1Details).as('getExamDetails')

    cy.get('.MuiTableBody-root > :nth-child(1) > .column-code').click()
    cy.get(':nth-child(1) > .column-title > .MuiTypography-root').click()
    cy.get('[data-testid="gradeScore"]').click({ multiple: true })
    cy.get('.RaEditableDatagrid-rowEven > .column-undefined').click().find('[data-testid="CreateIcon"]').click({ force: true })
    cy.get('.MuiTableBody-root > .css-1gvfpdu-MuiTableRow-root > :nth-child(3)').click('center').clear().type(newGrade.score)

    cy.intercept('PUT', `/courses/${course1Mock.id}/exams/${exam1.id}/grades`, exam1updatedGrades).as('modifyGrades')
    cy.intercept('GET', `/courses/${course1Mock.id}/exams/${exam1.id}/details`, exam1updatedGrades).as('getExamDetails')
    cy.intercept('GET', `/courses/${course1Mock.id}/exams/${exam1.id}/participants/${newGrade.student_id}`, targetParticipant).as('getParticipant')

    cy.get('[data-testid="SaveIcon"]').click()
    cy.contains('Élément mis à jour')
    cy.get('[data-testid="gradeScore"]').contains(newGrade.score)
  })
})
