import { mount, unmount } from '@cypress/react'
import App from '../App'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import { manager1Mock, teacher1Mock, teachersMock, whoamiManagerMock } from './mocks/responses'
import { manager1 } from './credentials'
import { updatedInfo } from './utils'

describe(specTitle('Manager.Teachers'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').type(manager1.username)
    cy.get('#password').type(manager1.password)
    cy.get('button').contains('Connexion').click()
    cy.intercept('GET', '/whoami', whoamiManagerMock).as('getWhoami')
    cy.intercept('GET', `/managers/${manager1Mock.id}`, manager1Mock).as('getManager')
    cy.intercept('GET', '/teachers?page=1&page_size=10', teachersMock).as('getTeachers')
    cy.intercept('GET', /teachers\?page=1&page_size=10&(first_name|ref|last_name)=/, [teacher1Mock]).as('getFilters')
    cy.intercept('GET', `/teachers/${teachersMock[0].id}`, teachersMock[0]).as('getTeachers1')
    cy.intercept('PUT', `/teachers`, [updatedInfo]).as('putUpdate')

    cy.wait('@getWhoami')
    cy.get('[href="#/teachers"]').click()
    cy.get(':nth-child(1) > .column-undefined > .MuiButtonBase-root').as('editButton')
    cy.get('.css-t6tio9-RaFilterButton-root > .MuiButtonBase-root').as('add-filter-button')
  })

  it('list all teachers', () => {
    cy.wait('@getManager')
    cy.viewport(1000, 950)
    cy.get('tbody tr').should('have.length', teachersMock.length)
    cy.get('a[aria-label="Créer"]').should('exist')
    cy.get('a[aria-label="Éditer"]').should('exist')
  })

  it('can filter teachers by first_name', () => {
    cy.get('#first_name').type(teacher1Mock.first_name)
    cy.wait('@getFilters')
    cy.get('tbody tr').should('have.length', 1).should('not.contain', teachersMock[1].first_name)
    cy.get('tbody tr').should('have.length', 1)
    cy.get('tbody tr:first-child').should('contain', teacher1Mock.first_name)
  })

  it('can filter teachers by last_name', () => {
    cy.get('#first_name').clear()
    cy.get('@add-filter-button').click()
    cy.get('.Mui-focusVisible').click()
    cy.get('#last_name').type(teacher1Mock.last_name)
    cy.wait('@getFilters')
    cy.get('tbody tr').should('have.length', 1).should('not.contain', teachersMock[1].first_name)
    cy.get('tbody tr').should('have.length', 1)
    cy.get('tbody tr:first-child').should('contain', teacher1Mock.first_name)
  })

  it('can filter teachers by ref', () => {
    cy.get('#first_name').clear()
    cy.get('@add-filter-button').click()
    cy.get('[data-key="ref"]').click()
    cy.get('#ref').type(teacher1Mock.ref)
    cy.wait('@getFilters')
    cy.get('tbody tr').should('have.length', 1).should('not.contain', teachersMock[1].first_name)
    cy.get('tbody tr').should('have.length', 1)
    cy.get('tbody tr:first-child').should('contain', teacher1Mock.first_name)
  })

  it('can edit teachers', () => {
    cy.get('@editButton').click()
    cy.wait('@getTeachers1')
    cy.get('#last_name').clear().type(updatedInfo.last_name)
    cy.get('[data-testid="SaveIcon"]').click()
    cy.intercept('GET', `/teachers/${teachersMock[0].id}`, updatedInfo).as('getTeachers1')
    cy.wait('@putUpdate')
    cy.get('@editButton').click()
    cy.wait('@getTeachers1')
    cy.get('#last_name').should('have.value', updatedInfo.last_name)
  })

  afterEach(() => {
    unmount()
  })
})
