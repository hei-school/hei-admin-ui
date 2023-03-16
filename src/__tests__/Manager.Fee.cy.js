import { mount, unmount } from '@cypress/react'
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
  createFeeWithManualDataMock,
  fee1Mock
} from './mocks/responses'
import { manualFeeTypes, predefinedFeeTypes, predefinedFirstDueDates } from '../conf'

const feeDateToSearch = `2022-09-11`
const feeCreatDate = 'date2'

describe(specTitle('Manager.Fee'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.intercept('GET', `/whoami`, whoamiManagerMock).as('getWhoami')
    cy.intercept('GET', `/managers/${manager1Mock.id}`, manager1Mock).as('getManager1')
    cy.intercept('GET', `/students?page=1&page_size=10`, studentsMock).as('getStudents')
    cy.intercept('GET', `/students?page=1&page_size=10&last_name=${studentNameToBeCheckedMock}`, [student1Mock]).as('getStudentsByName')
    cy.intercept('GET', `/students/${student1Mock.id}/fees/${fee1Mock.id}/payments?page=1&page_size=10`, []).as('getPayments')
    cy.intercept('GET', `/students/${student1Mock.id}/fees?page=1&page_size=500`, feesMock).as('getFees')
    cy.intercept('GET', `/students/${student1Mock.id}/fees/${fee1Mock.id}`, fee1Mock).as('getFee1')
    cy.intercept('GET', `/students/${student1Mock.id}`, student1Mock)
    cy.get('#username').type(manager1.username)
    cy.get('#password').type(manager1.password)
    cy.get('button').contains('Connexion').click()
    cy.wait('@getWhoami').get('a[href="#/profile"]').click()
    cy.wait('@getManager1')
    cy.wait('@getWhoami')
    cy.get('.RaMultiLevelMenu-navWithCategories')
    .should('contain', 'Étudiants')
    .and('contain', 'Enseignants')
    .and('contain', 'Mon profil')
    cy.get(':nth-child(3) > .MuiListItem-root').click()
    cy.get('a[href="#/students"]').click()
    cy.get('body').click(200, 0)
    cy.contains('Page : 1')
    cy.contains(`Taille : ${feesMock.length}`)
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
      `/students/${student1Mock.id}/fees/${feesMock.find(fee => fee.remaining_amount === fee1Mock.remaining_amount).id}`,
      feesMock.find(fee => fee.remaining_amount === fee1Mock.remaining_amount)
    ).as('getFee1')
    cy.intercept(
      'GET',
      `/students/${student1Mock.id}/fees/${feesMock.find(fee => fee.remaining_amount === fee1Mock.remaining_amount).id}/payments?page=1&page_size=10`,
      createPaymentMock(feesMock.find(fee => fee.remaining_amount === fee1Mock.remaining_amount))
    ).as('getPaymentsOfOneFee')
    cy.get('.show-page > .MuiToolbar-root > .MuiTypography-root').click() //click on fees
    cy.contains('200,000 Ar').click()
    cy.contains('En retard')
    unmount()
  })

  it('cannot create fees when fields are missing', () => {
    cy.get('.show-page > .MuiToolbar-root > .MuiTypography-root').click() //click on fees
    cy.get('[data-testid="AddIcon"] > path').click()
    cy.get('#predefined_type').click()
    cy.get('.MuiList-root > [tabindex="0"]').click()
    cy.contains('Enregistrer').click()
    cy.contains("Le formulaire n'est pas valide")
    unmount()
  })

  it('can create fees with predefined fields', () => {
    const feeTypeMock = "annualTuition1x"
    cy.intercept('POST', `/students/${student1Mock.id}/fees`, createFeeWithPredefinedDataMock(feeDateToSearch)).as('createFees')

    cy.get('.show-page > .MuiToolbar-root > .MuiTypography-root').click() //click on fees
    cy.get('.MuiFab-root').click() // create fees
    cy.get('#predefined_type').click()
    cy.get(`[data-value="${feeTypeMock}"]`).click()
    cy.get('#predefined_first_dueDate').click()
    cy.get(`[data-value="${feeCreatDate}"]`).click()
    cy.intercept('GET', `/students/${student1Mock.id}/fees?page=1&page_size=500`, addFeeMock(feesMock, createFeeWithPredefinedDataMock(feeDateToSearch)))
    cy.contains('Enregistrer').click()
    cy.wait('@createFees').then((requestIntersection) => {
      let createAutomaticallyFeesBodyMock = {
        comment: requestIntersection.request.body[0].comment,
        type: predefinedFeeTypes[feeTypeMock][0].type,
        total_amount:Number(predefinedFeeTypes[feeTypeMock][0].monthlyAmount),
        due_datetime: predefinedFirstDueDates[feeCreatDate].value.toISOString(),
        student_id: student1Mock.id
      }
      expect(requestIntersection.request.body[0]).to.deep.equal(createAutomaticallyFeesBodyMock)
      expect(requestIntersection.request.body.length).to.equal(1)
    })
    cy.contains('Élément créé')
    unmount()
  })
  it('can create fees with predefined fields equals to 9 months', () => {
    const feeTypeMock = 'annualTuition9x' 
    cy.intercept('POST', `/students/${student1Mock.id}/fees`, createFeeWithPredefinedDataMock(feeDateToSearch)).as('createNineFees')

    cy.get('.show-page > .MuiToolbar-root > .MuiTypography-root').click() //click on fees
    cy.get('.MuiFab-root').click() // create fees
    cy.get('#predefined_type').click()
    cy.get(`[data-value="${feeTypeMock}"]`).click()
    cy.get('#predefined_first_dueDate').click()
    cy.get(`[data-value="${feeCreatDate}"]`).click()
    cy.intercept('GET', `/students/${student1Mock.id}/fees?page=1&page_size=500`, addFeeMock(feesMock, createFeeWithPredefinedDataMock(feeDateToSearch)))
    cy.contains('Enregistrer').click()
    cy.wait('@createNineFees').then((requestIntersection) => {
      let createAutomaticallyFeesBodyMock = {
        comment: requestIntersection.request.body[0].comment,
        type: predefinedFeeTypes[feeTypeMock][0].type,
        total_amount:Number(predefinedFeeTypes[feeTypeMock][0].monthlyAmount),
        due_datetime: predefinedFirstDueDates[feeCreatDate].value.toISOString(),
        student_id: student1Mock.id
      }
      expect(requestIntersection.request.body[0]).to.deep.equal(createAutomaticallyFeesBodyMock)
      expect(requestIntersection.request.body.length).to.equal(9)
    })
    cy.contains('Élément créé')
    unmount()
  })
  it.only('can create fees with manual fields', () => {
    const monthlyAmount = (1 + Math.floor(Math.random() * 2_000_000)).toString()
    const monthsNumber = 1 + Math.floor(Math.random() * 3)
    const comment = 'Dummy comment'
    const manuallyCreatedFees = createFeeWithManualDataMock(feeDateToSearch, monthlyAmount, comment, monthsNumber)
    cy.intercept('POST', `/students/${student1Mock.id}/fees`, manuallyCreatedFees).as('createFees')
    cy.get('.show-page > .MuiToolbar-root > .MuiTypography-root').click() //click on fees
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

    cy.wait('@createFees').then((requestIntersection) => {
      const feeTypeMock = "tuition"
      let createAutomaticallyFeesBodyMock = {
        comment: comment + " " + '(2022)',
        type: manualFeeTypes[feeTypeMock].type,
        total_amount:"0"+monthlyAmount,
        due_datetime: ""+feeDateToSearch+"T21:00:00.000Z",
        student_id: student1Mock.id
      }
      expect(requestIntersection.request.body[0]).to.deep.equal(createAutomaticallyFeesBodyMock)
      expect(requestIntersection.request.body.length).to.equal(monthsNumber)
    })

    cy.contains('Élément créé')
    unmount()
  })
})
