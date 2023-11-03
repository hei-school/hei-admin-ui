import { mount } from '@cypress/react'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import App from '../App'
import { manager1 } from './credentials'
import { manager1Mock, studentsMock, whoamiManagerMock } from './mocks/responses'
import { addGroupFlow, leaveGroupFlow, migrateGroupFlow } from './mocks/responses/group-flow-api'
import { editedGroup, group1Students, groups, newGroup1, student1 } from './mocks/responses/groups-api'

const group1 = groups[0]
const student = group1Students[0]

const filterAndShow = () => {
  cy.contains('Ajouter un filtre').click()
  cy.get('[data-key="ref"]').click()
  cy.get('#ref').type(group1.ref)
  cy.contains(`Afficher`).click()
}
describe(specTitle('Manager and groups'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').type(manager1.username)
    cy.get('#password').type(manager1.password)
    cy.get('button').contains('Connexion').click()

    cy.intercept('GET', `/whoami`, whoamiManagerMock).as('getWhoami')
    cy.intercept('GET', `/managers/${manager1Mock.id}`, manager1Mock).as('getManager1')
    cy.intercept('GET', `/groups?page=1&page_size=10`, groups).as('getGroups')
    cy.intercept('GET', `/students?page=1&page_size=25`, studentsMock).as('getStudents')
    cy.intercept('GET', `/groups?page=1&page_size=10&ref=${group1.ref}`, [group1]).as('getFilteredGroup')
    cy.intercept('GET', `/groups/${group1.id}`, group1).as('getGroup1')
    cy.intercept('GET', `/groups/${group1.id}/students?page=1&page_size=10`, group1Students).as('getGroupStudents')
    cy.intercept('GET', `/groups?page=1&page_size=25`, groups).as('getGroups')
    cy.intercept('GET', `/students?page=1&page_size=10`, studentsMock).as('getStudents')

    cy.wait('@getWhoami')

    cy.get("[data-testid='groups']").click()
  })

  it('can view groups list', () => {
    cy.contains('Liste de groupes')
    cy.contains('Référence')
    cy.contains('Nom')
    cy.contains('Année de création')
  })
  it('can create a group without student list', () => {
    const { ref, name, students } = newGroup1

    cy.intercept('PUT', `/groups`, [newGroup1]).as('createGroup')

    cy.get('[data-testid="AddIcon"]').click()

    cy.get('#ref').type(ref)
    cy.get('#name').type(name)

    cy.get("[data-testid='group-students']").click()
    cy.get(`[data-value="${students[0]}"]`).click().as('selectStudent')
    cy.get(`[data-value="${students[1]}"]`).click().as('selectStudent')

    cy.contains('Enregistrer').click({ force: true })

    cy.contains('Élément créé')
  })
  it('can create a group with student list', () => {
    const { ref, name } = newGroup1
    const { students, ...withoutGroups } = newGroup1

    cy.intercept('PUT', `/groups`, [withoutGroups]).as('createGroup')

    cy.get('[data-testid="AddIcon"]').click()
    cy.get('#ref').type(ref)
    cy.get('#name').type(name)
    cy.contains('Enregistrer').click({ force: true })
    cy.contains('Élément créé')
  })
  it('can view a group detail', () => {
    filterAndShow()
    cy.contains('Référence')
    cy.contains('Nom')
    cy.contains('Date de création')
    cy.contains('Les étudiants dans ce groupe')
  })
  it('can edit a group', () => {
    const { ref, name } = editedGroup
    const newGroupList = [editedGroup, groups[1]]

    cy.intercept('GET', `/groups?page=1&page_size=10`, newGroupList).as('getGroups')
    cy.intercept('PUT', `/groups`, [editedGroup]).as('createGroup')

    filterAndShow()
    cy.contains('Éditer').click()
    cy.get('#ref').clear().type(ref)
    cy.get('#name').clear().type(name)
    cy.contains('Enregistrer').click()

    cy.contains('Élément mis à jour')
    cy.contains(ref)
    cy.contains(name)
  })
  it('can remove a specific student from a group students list', () => {
    cy.intercept('POST', `/students/${student.id}/group_flows`, leaveGroupFlow).as('removeStudent')

    filterAndShow()
    cy.contains('Supprimer').click()
    cy.contains('Confirmer').click()

    cy.contains(`Etudiant ${student.ref} supprimé de ce groupe avec succès`)
  })
  it('can migrate a student from a group to another', () => {
    cy.intercept('POST', `/students/${student.id}/group_flows`, migrateGroupFlow).as('removeStudent')

    filterAndShow()
    cy.contains('Migrer').click()
    cy.get("[data-testid='groups-autocomplete']").click()
    cy.contains(`${groups[1].ref}`).click().as('selectGroup')
    cy.contains('Envoyer').click()

    cy.contains(`L'étudiant ${student.ref} a été migré avec succès`)
  })
  it('can add a student to a group', () => {
    cy.intercept('POST', `/students/${student1.id}/group_flows`, addGroupFlow).as('removeStudent')

    filterAndShow()
    cy.contains('Créer').click()
    cy.get("[data-testid='students-autocomplete']").click()
    cy.contains(`${student1.ref}`).click().as('selectStudent')
    cy.get("[data-testid='groups-autocomplete']").click()
    cy.contains(`${group1.ref}`).click({ force: true }).as('selectGroup')
    cy.contains('Envoyer').click()

    cy.contains(`L'étudiant ${student1.ref} a été migré avec succès`)
  })
})
