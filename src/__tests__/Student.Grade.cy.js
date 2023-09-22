import { mount, unmount } from '@cypress/react'
import App from '../App'
import '../../cypress/support/commands'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import { gradesMock, student1Mock } from './mocks/responses'
import { WhoamiRoleEnum } from '../gen/haClient'

describe(specTitle('Course'), () => {
  beforeEach(() => {
    mount(<App />)

    cy.intercept('GET', `/students/${student1Mock.id}`, student1Mock).as('getStudent1')
    cy.intercept('GET', `/students/${student1Mock.id}/grades`, gradesMock).as('getStudent1Grades')

    cy.cognitoLogin(WhoamiRoleEnum.Student)

    cy.wait('@getStudent1')
    cy.get('.RaMultiLevelMenu-navWithCategories').contains('Notes').click()
    cy.wait('@getStudent1Grades')
  })

  it('can read list and filter but can not edit', () => {
    cy.get('#main-content').should('contain', 'Titre').and('contain', 'Cours').and('contain', 'Point').and('contain', 'Date').and('contain', 'heure')
    cy.get('#main-content').should('not.contain', 'Éditer').and('not.contain', 'Créer')
    cy.get('td')
      .should('contain', gradesMock[0].name)
      .and('contain', gradesMock[0].exams[0].coefficient)
      .and('contain', gradesMock[0].exams[0].grade.score)
      .and('contain', gradesMock[0].exams[0].title)
      .and('contain', gradesMock[gradesMock.length - 1].exams[gradesMock[gradesMock.length - 1].exams.length - 1].coefficient)
      .and('contain', gradesMock[gradesMock.length - 1].exams[gradesMock[gradesMock.length - 1].exams.length - 1].grade.score)
      .and('contain', gradesMock[gradesMock.length - 1].exams[gradesMock[gradesMock.length - 1].exams.length - 1].title)
  })

  afterEach(() => {
    cy.get('.RaMultiLevelMenu-navWithCategories').contains('Mon profil').click()
    cy.wait('@getStudent1')
    unmount()
  })
})
