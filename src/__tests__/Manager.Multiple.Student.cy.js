import { mount, unmount } from '@cypress/react'
import App from '../App'
import { manager1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import {
  manager1Mock,
  student1Mock,
  studentNameToBeCheckedMock,
  studentsMock,
  whoamiManagerMock, createdStudents
} from './mocks/responses'

const importFile = (file, message) => {
  cy.intercept('GET', `/students/${student1Mock.id}`, student1Mock)
  cy.contains('Étudiants')
  cy.wait('@getWhoami')

  cy.get('[data-testid=\'profileMenuItem\']').click()
  cy.get('[data-testid=\'studentsMenuItem\']').click()

  cy.get('[href="#/students"]').click()
  cy.get('body').click(200, 0) //note(uncover-menu)
  const _path = 'cypress/fixtures';
  const _mockFile = `${_path}/${file}`;
  cy.get('[data-testid="inputFile"]').selectFile(_mockFile, {force: true})

  cy.contains('Oui').click()

  cy.contains(message)
}
describe(specTitle('Manager create multiple students'), () => {
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
  })

  it('cannot create students if the file is empty', () => {
    importFile('empty_template.xlsx', "Il n'y a pas d'élément à insérer")
    unmount()
  })
  it('cannot create students if there is too much students to create', () => {
    importFile('too_big.xlsx', 'Vous ne pouvez importer que 10 éléments à la fois.')
    unmount()
  })
  it('cannot create students if the headers are not corrects', () => {
    importFile('diff_headers_template.xlsx', 'Veuillez re-vérifier les en-têtes de votre fichier')
    unmount()
  })
  it('can create multiple students with the correct file', () => {
    cy.intercept('PUT', '/students', [createdStudents]).as('createStudents')
    importFile('good_template.xlsx', 'Importation effectuée avec succès')
    unmount()
  })
  it('notifies if the multiple students creation failed', () => {
    cy.intercept('PUT', '/students', {
      statusCode: 500,
      body: {
        message: 'error'
      }
    }).as('createStudent')
    importFile('good_template.xlsx', "L'importation n'a pas pu être effectuée")
    unmount()
  })
})


