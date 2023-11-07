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
import { prettyPrintMoney, statusRenderer, TurnsStringIntoDate } from '../operations/utils'

const feeDateToSearch = `2022-09-11`
const feeCreatDate = 'date2'

describe(specTitle('Manager.Fee'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.intercept('GET', `/whoami`, whoamiManagerMock).as('getWhoami')
    cy.intercept('GET', `/managers/${manager1Mock.id}`, req => {
      req.reply(res => {
        res.setDelay(500)
        res.send(manager1Mock)
      })
    }).as('getManager1')
    cy.intercept('GET', `/students?page=1&page_size=10`, studentsMock).as('getStudents')
    cy.intercept('GET', `/students?page=1&page_size=10&last_name=${studentNameToBeCheckedMock}`, [student1Mock]).as('getStudentsByName')
    cy.intercept('GET', `/students/${student1Mock.id}/fees/${fee1Mock.id}/payments?page=1&page_size=10`, []).as('getPayments')
    cy.intercept('GET', `/students/${student1Mock.id}/fees?page=1&page_size=500`, feesMock).as('getFees')
    cy.intercept('GET', `/students/${student1Mock.id}/fees/${fee1Mock.id}`, fee1Mock).as('getFee1')
    cy.intercept('GET', `/students/${student1Mock.id}`, student1Mock)
    cy.get('#username').type(manager1.username)
    cy.get('#password').type(manager1.password)
    cy.get('button').contains('Connexion').click()
    cy.wait('@getWhoami')
    cy.get('[data-testid="students-menu"]').click()
    cy.get('a[href="#/students"]').click()
    cy.get('body').click(200, 0)
    cy.contains('Page : 1')
    cy.contains(`Taille : ${feesMock.length}`)
    cy.get('td input[type="checkbox"]', { timeout: 50 }).should('not.exist')
    cy.get('[data-testid="FilterListIcon"]').click()
    cy.get('[data-key="last_name"] > :nth-child(1)').click()
    cy.get('#last_name').click()
    cy.get('#last_name').type(studentNameToBeCheckedMock)
    cy.contains('Page : 1')
    cy.contains('Taille : 1 ')
    cy.contains(studentNameToBeCheckedMock).click()
  })

  it('can detail waiting fee', () => {
    const interceptedFeeMock = feesMock.find(fee => fee.remaining_amount === fee1Mock.remaining_amount)
    cy.intercept('GET', `/students/${student1Mock.id}/fees/${interceptedFeeMock.id}`, interceptedFeeMock).as('getFee1')
    cy.intercept('GET', `/students/${student1Mock.id}/fees/${interceptedFeeMock.id}/payments?page=1&page_size=10`, createPaymentMock(interceptedFeeMock)).as(
      'getPaymentsOfOneFee'
    )
    cy.get('.show-page > .MuiToolbar-root > .MuiTypography-root').click() //click on fees
    cy.contains(student1Mock.ref)
    cy.contains(prettyPrintMoney(interceptedFeeMock.remaining_amount)).click()
    cy.get('#main-content')
      .should('contain', prettyPrintMoney(interceptedFeeMock.remaining_amount))
      .and('contain', prettyPrintMoney(interceptedFeeMock.total_amount))
      .and('contain', interceptedFeeMock.comment)
      .and('contain', statusRenderer(interceptedFeeMock.status))
      .and('contain', 'Paiements')
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
    const feeTypeMock = 'annualTuition1x'
    cy.intercept('POST', `/students/${student1Mock.id}/fees`, createFeeWithPredefinedDataMock(feeDateToSearch)).as('createFees')

    cy.get('.show-page > .MuiToolbar-root > .MuiTypography-root').click() //click on fees
    cy.get('.MuiFab-root').click() // create fees
    cy.get('#predefined_type').click()
    cy.get(`[data-value="${feeTypeMock}"]`).click()
    cy.get('#predefined_first_dueDate').click()
    cy.get(`[data-value="${feeCreatDate}"]`).click()
    cy.intercept('GET', `/students/${student1Mock.id}/fees?page=1&page_size=500`, addFeeMock(feesMock, createFeeWithPredefinedDataMock(feeDateToSearch)))
    cy.contains('Enregistrer').click()
    cy.wait('@createFees').then(requestIntersection => {
      let createAutomaticallyFeesBodyMock = {
        comment: requestIntersection.request.body[0].comment,
        type: predefinedFeeTypes[feeTypeMock][0].type,
        total_amount: Number(predefinedFeeTypes[feeTypeMock][0].monthlyAmount),
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
    cy.wait('@createNineFees').then(requestIntersection => {
      let createAutomaticallyFeesBodyMock = {
        comment: requestIntersection.request.body[0].comment,
        type: predefinedFeeTypes[feeTypeMock][0].type,
        total_amount: Number(predefinedFeeTypes[feeTypeMock][0].monthlyAmount),
        due_datetime: predefinedFirstDueDates[feeCreatDate].value.toISOString(),
        student_id: student1Mock.id
      }
      expect(requestIntersection.request.body[0]).to.deep.equal(createAutomaticallyFeesBodyMock)
      expect(requestIntersection.request.body.length).to.equal(9)
    })
    cy.contains('Élément créé')
    unmount()
  })

  it('can create fees with manual fields', () => {
    const monthlyAmount = 200000 //(1 + Math.floor(Math.random() * 2_000_000)).toString()
    const monthsNumber = 5 //1 + Math.floor(Math.random() * 3)
    const comment = 'Dummy comment'
    const manuallyCreatedFees = createFeeWithManualDataMock(feeDateToSearch, monthlyAmount, comment, monthsNumber)
    cy.intercept('POST', `/students/${student1Mock.id}/fees`, manuallyCreatedFees).as('createFees')
    cy.get('.show-page > .MuiToolbar-root > .MuiTypography-root').click() //click on fees
    cy.get('.MuiFab-root').click() // create fees
    cy.get('#is_predefined_type').click()
    cy.get('#manual_type_tuition').click()
    cy.get('#monthly_amount').click().clear().type(monthlyAmount)

    cy.get('#months_number').click().clear().type(monthsNumber)

    cy.get('#comment').click().clear().type(comment)

    cy.get('#is_predefined_first_dueDate').click()
    cy.get('#manual_first_duedate').click().type(feeDateToSearch)

    cy.intercept('GET', `/students/${student1Mock.id}/fees?page=1&page_size=500`, addFeeMock(feesMock, manuallyCreatedFees)).as('getFees')
    cy.contains('Enregistrer').click()
    /*
    cy.wait('@createFees').then(requestIntersection => {
     const feeTypeMock = 'tuition'
      let createAutomaticallyFeesBodyMock = {
        comment: comment,
        type: manualFeeTypes[feeTypeMock].type,
        total_amount: monthlyAmount,
        due_datetime: TurnsStringIntoDate(feeDateToSearch),
        student_id: student1Mock.id
      }
      expect(requestIntersection.request.body[0]).to.deep.equal(createAutomaticallyFeesBodyMock)
      expect(requestIntersection.request.body.length).to.equal(monthsNumber)
    })

    cy.contains('Élément créé') 
    */
    unmount()
  })
  it('can create fees with manual fields without writing comments', () => {
    const monthlyAmount = 1 + Math.floor(Math.random() * 2_000_000)
    const monthsNumber = 1 + Math.floor(Math.random() * 3)
    const manuallyCreatedFees = createFeeWithManualDataMock(feeDateToSearch, monthlyAmount, null, monthsNumber)
    cy.intercept('GET', `/students/${student1Mock.id}/fees?page=1&page_size=500`, feesMock).as('getFees')
    cy.intercept('POST', `/students/${student1Mock.id}/fees`, manuallyCreatedFees)
    cy.get('.show-page > .MuiToolbar-root > .MuiTypography-root').click() //click on fees
    cy.get('.MuiFab-root').click() // create fees
    cy.get('#is_predefined_type').click()
    cy.get('#manual_type_tuition').click()
    cy.get('#monthly_amount').click().type(monthlyAmount)

    cy.get('#months_number').click().type(monthsNumber)

    cy.get('#is_predefined_first_dueDate').click()
    cy.get('#manual_first_duedate').click().type(feeDateToSearch)

    cy.intercept('GET', `/students/${student1Mock.id}/fees?page=1&page_size=500`, addFeeMock(feesMock, manuallyCreatedFees)).as('getFees')
    cy.contains('Enregistrer').click()
    cy.contains('Élément créé')
    cy.contains('-')
    unmount()
  })
})
