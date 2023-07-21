import { mount, unmount } from '@cypress/react'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import App from '../App'
import { manager1 } from './credentials'
import {
  course1EditMock,
  course1Mock,
  course1exams,
  courseCreatedMock,
  courseNameToBeCheckedMock,
  coursesMock,
  filterCourseByNameMock,
  manager1Mock,
  teachersMock,
  whoamiManagerMock
} from './mocks/responses'
const courseVerificationMock = creatCourseMock => {
  return requestIntersection => {
    let pendingCourseMock = {
      id: creatCourseMock.id,
      code: creatCourseMock.code,
      credits: '' + creatCourseMock.credits,
      name: creatCourseMock.name,
      total_hours: '' + creatCourseMock.total_hours,
      main_teacher_id: creatCourseMock.main_teacher.id
    }
    requestIntersection.request.body[0].id
      ? expect(requestIntersection.request.body[0]).to.deep.equal(pendingCourseMock)
      : expect({ ...requestIntersection.request.body[0], id: creatCourseMock.id }).to.deep.equal(pendingCourseMock)
    expect(requestIntersection.request.body.length).to.equal(1)
  }
}

describe(specTitle('Course'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.intercept('GET', `/whoami`, whoamiManagerMock).as('getWhoami')
    cy.intercept('GET', `/managers/${manager1Mock.id}`, manager1Mock).as('getManager1')
    cy.intercept('GET', `/courses?page=1&page_size=10`, coursesMock).as('getCourses')
    cy.intercept('GET', `/teachers?page=1&page_size=100`, teachersMock).as('getteachers')
    cy.intercept('GET', `/courses/${courseCreatedMock.id}`, courseCreatedMock).as('getCourseCreated')
    cy.intercept('GET', `/courses/${course1Mock.id}/exams`, course1exams).as('getcourse1exams')
    cy.intercept('GET', `/courses/${course1Mock.id}`, course1Mock).as('getCourse1')
    cy.get('#username').type(manager1.username)
    cy.get('#password').type(manager1.password)
    cy.get('button').contains('Connexion').click()
    cy.get('.RaMultiLevelMenu-navWithCategories').contains('Cours').click()
    cy.wait('@getCourses')
  })

  it('can read list and filter', () => {
    cy.intercept('GET', `/courses?name=${courseNameToBeCheckedMock}&page=1&page_size=10`, filterCourseByNameMock).as('getCoursesfiltred')
    cy.get('#main-content')
      .should('contain', 'Code')
      .and('contain', 'Nom')
      .and('contain', "Total d'heures")
      .and('contain', 'Coefficient')
      .and('contain', `Taille : ${coursesMock.length}`)
    cy.get('td').should('contain', course1Mock.name)
    cy.get('[data-testid="FilterListIcon"]').click()
    cy.get('[data-key="name"]').click()
    cy.get('#name').type(courseNameToBeCheckedMock)
    cy.wait('@getCoursesfiltred')
    cy.get('#main-content').should('contain', `Taille : ${filterCourseByNameMock.length}`).and('contain', courseNameToBeCheckedMock)
    cy.get('[data-testid="HighlightOffIcon"] > path').click()
  })

  it('can read and edit one course details', () => {
    cy.intercept('PUT', `/courses`, [course1EditMock]).as('editCourse1')
    cy.get('.MuiToolbar-root').should('not.contain', 'Éditer')
    cy.get('#main-content table td>a').should('contain', 'Éditer')
    cy.get('td').contains(course1Mock.name).click()
    cy.wait('@getCourse1')
    cy.get('.RaBreadcrumb-list').should('contain', course1Mock.code)
    cy.get('#main-content').should('contain', 'code').and('contain', course1Mock.name).and('contain', course1Mock.code).and('contain', course1Mock.credits)
    cy.get('table').should('contain', 'Détails').and('contain', 'Coefficient')
    cy.get('#main-content').contains('Éditer').click()
    cy.get(`[value="${course1Mock.name}"]`)
    cy.get(`[value="${course1Mock.code}"]`)
    cy.get(`[value="${course1Mock.credits}"]`)
    cy.get('#code').click().clear().type(course1EditMock.code)
    cy.get('#name').click().clear().type(course1EditMock.name)
    cy.get('#credits').click().clear().type(course1EditMock.credits)
    cy.get('#total_hours').click().clear().type(course1EditMock.total_hours)
    cy.get('#main_teacher_id').click()
    cy.get('[aria-labelledby="main_teacher_id-label"]').contains(course1EditMock.main_teacher.first_name).click()
    cy.get('button').contains('Enregistrer').click()
    cy.get('#__cy_root').contains('Élément mis à jour')
    cy.intercept('GET', `/courses?page=1&page_size=10`, [course1EditMock, ...coursesMock.slice(1, coursesMock.length)]).as('getCourses')
    cy.wait('@editCourse1').then(courseVerificationMock(course1EditMock))
    cy.wait('@getCourses')
    cy.get('#main-content').should('contain', 'Code').and('contain', course1EditMock.name).and('contain', course1EditMock.credits)
  })

  it('can creat new course', () => {
    cy.intercept('PUT', `/courses`, [courseCreatedMock]).as('createCourse')
    cy.get('[href="#/courses/create"]').click()
    cy.get('#code').type(courseCreatedMock.code)
    cy.get('#name').type(courseCreatedMock.name)
    cy.get('#credits').type(courseCreatedMock.credits)
    cy.get('#total_hours').type(courseCreatedMock.total_hours)
    cy.get('#main_teacher_id').click()
    cy.get('[aria-labelledby="main_teacher_id-label"]').contains(courseCreatedMock.main_teacher.first_name).click()
    cy.get('button').contains('Enregistrer').click()
    cy.intercept('GET', `/courses?page=1&page_size=10`, [courseCreatedMock, ...coursesMock.slice(1, coursesMock.length)]).as('getCourses')
    cy.wait('@createCourse').then(courseVerificationMock(courseCreatedMock))
    cy.wait('@getCourses')
    cy.get('#__cy_root').contains('Élément créé')
    cy.get('#main-content').should('contain', 'Code').and('contain', courseCreatedMock.name).and('contain', courseCreatedMock.credits)
  })

  afterEach(() => {
    cy.get('.RaMultiLevelMenu-navWithCategories').contains('Mon profil').click()
    cy.wait('@getManager1')
    unmount()
  })
})
