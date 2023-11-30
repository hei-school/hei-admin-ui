import { mount } from '@cypress/react'
import App from '../App'
import { manager1 } from './credentials'
import { EnableStatus, Sex } from 'haapi-Ts-client'

const filters = {
  ref: 'STD00001',
  lastName: 'Doe',
  firstName: 'John',
  status: { value: EnableStatus.ENABLED, name: 'Actif.ve' },
  sex: { value: Sex.F, name: 'Femme' }
}
const checkParameters = parameters => {
  cy.intercept('/students*', request => {
    parameters.forEach(param => {
      expect(request.url).to.include(param)
    })
  })
}
const clickFilterAction = () => {
  cy.get('[data-testid="students-menu"]').click()
  cy.get('[href="#/students"]').click()
  cy.get('[data-testid="menu-list-action"]').click()
  cy.get('[data-testid="add-filter"]').click()
}
// Not intercepted because this will be nonsense
describe('Manager filter students', () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').clear().type(manager1.username)
    cy.get('#password').clear().type(manager1.password)
    cy.get('button').contains('Connexion').click()
  })
  it('can filter students by one criteria', () => {
    clickFilterAction()
    cy.get('[data-testid="filter-profile-first_name"]').clear().type(filters.firstName)
    checkParameters([`first_name=${filters.firstName}`])
    cy.get('[data-testid="apply-filter"]').click()
  })
  it('can filter students by multiple criteria', () => {
    clickFilterAction()
    cy.get('[data-testid="filter-profile-ref"]').clear().type(filters.ref)
    cy.get('[data-testid="filter-profile-first_name"]').clear().type(filters.firstName)
    cy.get('[data-testid="apply-filter"]').click()
    checkParameters([`first_name=${filters.firstName}`, `ref=${filters.ref}`])
    cy.get('[data-testid="apply-filter"]').click()
  })
  it('can filter students by status', () => {
    clickFilterAction()
    cy.get('[data-testid="filter-profile-status"]').click()
    cy.contains(filters?.status?.name).click()
    cy.get('[data-testid="apply-filter"]').click()
    checkParameters([`status=${filters?.status?.value}`])
    cy.get('[data-testid="apply-filter"]').click()
  })
  it('can filter students by multiple criteria sex included', () => {
    clickFilterAction()
    cy.get('[data-testid="filter-profile-sex"]').click()
    cy.contains(filters?.sex?.name).click()
    cy.get('[data-testid="filter-profile-first_name"]').clear().type(filters.firstName)
    cy.get('[data-testid="apply-filter"]').click()
    checkParameters([`sex=${filters?.sex?.value}`, `first_name=${filters.firstName}`])
    cy.get('[data-testid="apply-filter"]').click()
  })
})
