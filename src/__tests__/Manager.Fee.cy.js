import { mount } from '@cypress/react'
import App from '../App'
import { manager1 } from './credentials'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import {
  manager1Mock,
  student1Mock,
  studentNameToBeCheckedMock,
  studentsMock,
  feesMock,
  whoamiManagerMock,
  createPaymentMock,
  addFeeMock,
  createFeeWithPredefinedDataMock,
  createFeeWithManualDataMock
} from './mocks/responses'

const feeDateToSearch = `2022-09-11`

describe(specTitle('Manager.Fee'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').type(manager1.username)
    cy.get('#password').type(manager1.password)
    cy.get('button').contains('Connexion').click()

    cy.intercept('GET', `/managers/${manager1Mock.id}`, manager1Mock).as('getManager1')
    cy.intercept('GET', `/students?page=1&page_size=10`, studentsMock).as('getStudents')
    cy.intercept('GET', `/students?page=1&page_size=10&last_name=${studentNameToBeCheckedMock}`, [student1Mock]).as('getStudentsByName')
    cy.intercept('GET', `/students/${student1Mock.id}/fees?page=1&page_size=500`, feesMock).as('getFees')
    cy.intercept('GET', `/students/${student1Mock.id}`, student1Mock)
    cy.contains('Étudiants')
    cy.contains('Enseignants')
    cy.contains('Mon profil')
    cy.get(':nth-child(2) > .MuiListItem-root').click()
    cy.get(':nth-child(1) > .MuiListItem-root').click()
    cy.wait('@getManager1').get('a[href="#/profile"]').click()
    cy.intercept('GET', `/whoami`, whoamiManagerMock).as('getWhoami')
    cy.get(':nth-child(3) > .MuiListItem-root').click()
    cy.get('a[href="#/students"]').click()
    cy.get('body').click(200, 0)
    cy.get('[data-testid="FilterListIcon"]').click()
    cy.get('[data-key="last_name"] > :nth-child(1)').click()
    cy.get('#last_name').click()
    cy.get('#last_name').type(studentNameToBeCheckedMock)
    cy.contains('Page : 1')
    cy.contains('Taille : 1 ')
    cy.contains(studentNameToBeCheckedMock).click()
  })

  it('can detail waiting fee', () => {
    cy.intercept(
      'GET',
      `/students/${student1Mock.id}/fees/${feesMock.find(fee => fee.remaining_amount === 200000).id}`,
      feesMock.find(fee => fee.remaining_amount === 200000)
    ).as('getFee1')
    cy.intercept(
      'GET',
      `/students/${student1Mock.id}/fees/${feesMock.find(fee => fee.remaining_amount === 200000).id}/payments?page=1&page_size=10`,
      createPaymentMock(feesMock.find(fee => fee.remaining_amount === 200000))
    ).as('getPaymentsOfOneFee')
    cy.get('.show-page > .MuiToolbar-root > .MuiTypography-root').click()
    cy.contains('200,000 Ar').click()
    cy.contains('En retard')
  })

  it('cannot create fees when fields are missing', () => {
    cy.get('.show-page > .MuiToolbar-root > .MuiTypography-root').click()
    cy.get('[data-testid="AddIcon"] > path').click()
    cy.get('#predefined_type').click()
    cy.get('.MuiList-root > [tabindex="0"]').click()
    cy.contains('Enregistrer').click()

    cy.contains("Le formulaire n'est pas valide")
  })

  it('can create fees with predefined fields', () => {
    cy.intercept('GET', `/students/${student1Mock.id}/fees?page=1&page_size=500`, feesMock).as('getFees')
    cy.intercept('POST', `/students/${student1Mock.id}/fees`, createFeeWithPredefinedDataMock(feeDateToSearch))

    cy.get('.show-page > .MuiToolbar-root > .MuiTypography-root').click()
    cy.get('.MuiFab-root').click() // create fees
    cy.get('#predefined_type').click()
    cy.get('.MuiList-root > [tabindex="0"]').click()
    cy.get('#predefined_first_dueDate').click()
    cy.get('[data-value="jan22"]').click()
    cy.intercept('GET', `/students/${student1Mock.id}/fees?page=1&page_size=500`, addFeeMock(feesMock, createFeeWithPredefinedDataMock(feeDateToSearch)))
    cy.contains('Enregistrer').click()

    cy.contains('Élément créé')
  })
  it('can create fees with predefined fields equals to 9 months', () => {
    cy.intercept('GET', `/students/${student1Mock.id}/fees?page=1&page_size=500`, feesMock).as('getFees')
    cy.intercept('POST', `/students/${student1Mock.id}/fees`, createFeeWithPredefinedDataMock(feeDateToSearch))

    cy.get('.show-page > .MuiToolbar-root > .MuiTypography-root').click()
    cy.get('.MuiFab-root').click() // create fees
    cy.get('#predefined_type').click()
    cy.get('[data-value="annualTuition9x"]').click()
    cy.get('#predefined_first_dueDate').click()
    cy.get('[data-value="jan22"]').click()
    cy.intercept('GET', `/students/${student1Mock.id}/fees?page=1&page_size=500`, addFeeMock(feesMock, createFeeWithPredefinedDataMock(feeDateToSearch)))
    cy.contains('Enregistrer').click()

    cy.contains('Élément créé')
  })
  it('can create fees with manual fields', () => {
    const monthlyAmount = 1 + Math.floor(Math.random() * 2_000_000)
    const monthsNumber = 1 + Math.floor(Math.random() * 3)
    const comment = 'Dummy comment'
    const manuallyCreatedFees = createFeeWithManualDataMock(feeDateToSearch, monthlyAmount, comment, monthsNumber)
    cy.intercept('GET', `/students/${student1Mock.id}/fees?page=1&page_size=500`, feesMock).as('getFees')
    cy.intercept('POST', `/students/${student1Mock.id}/fees`, manuallyCreatedFees)
    cy.get('.show-page > .MuiToolbar-root > .MuiTypography-root').click()
    cy.get('.MuiFab-root').click() // create fees
    cy.get('#is_predefined_type').click()
    cy.get('#manual_type_tuition').click()
    cy.get('#monthly_amount').click().type(monthlyAmount)

    cy.get('#months_number').click().type(monthsNumber)

    cy.get('#comment').click().type(comment)

    cy.get('#is_predefined_first_dueDate').click()
    cy.get('#manual_first_duedate').click().type(feeDateToSearch)

    cy.intercept('GET', `/students/${student1Mock.id}/fees?page=1&page_size=500`, addFeeMock(feesMock, manuallyCreatedFees)).as('getFees')
    cy.contains('Enregistrer').click()
    cy.contains('Élément créé')
  })
})
