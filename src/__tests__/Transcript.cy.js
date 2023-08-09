import { mount, unmount } from '@cypress/react'
import App from '../App'
import specTitle from 'cypress-sonarqube-reporter/specTitle'
import {
  manager1Mock,
  student1Mock,
  studentNameToBeCheckedMock,
  studentsMock,
  teacher1Mock,
  teacherNameToBeCheckedMock,
  teachersMock,
  whoamiManagerMock
} from './mocks/responses'
import { claims1Mock, claimsMock, transcript1Mock, transcriptsMock, transcriptsVersion1Mock, transcriptsVersionMock } from './mocks/responses/transcripts-api'
import { manager1 } from './credentials'

describe(specTitle('Transcripts'), () => {
  beforeEach(() => {
    mount(<App />)
    cy.intercept('GET', `/whoami`, whoamiManagerMock).as('getWhoami')
    cy.intercept('GET', `/managers/${manager1Mock.id}`, req => {
      req.reply(res => {
        res.setDelay(500)
        res.send(manager1Mock)
      })
    }).as('getManager1')
    cy.intercept('GET', `/students?page=1&page_size=10`, studentsMock).as('getStudentsPage1')
    cy.intercept('GET', `/students?page=2&page_size=10`, studentsMock).as('getStudentsPage2')

    cy.get('#username').type(manager1.username)
    cy.get('#password').type(manager1.password)
    cy.get('button').contains('Connexion').click()
    cy.get('a[href="#/profile"]').click()
    cy.wait('@getManager1')
    cy.get(':nth-child(3) > .MuiListItem-root').click()
    cy.get('a[href="#/students"]').click()
  })

  it('can list all transcripts for a student', () => {
    cy.get('body')
        cy.intercept('GET', `/students/${student1Mock.id}/transcripts?page=1&page_size=10`, transcriptsMock).as('getTranscripts')

    cy.get(':nth-child(1) > :nth-child(4) > .MuiTypography-body2 > .MuiTypography-root').click()

    cy.wait('@getTranscripts')

    cy.get('body')
    cy.contains('Semestre')
    cy.contains('Année académique')
    cy.contains(transcript1Mock.academic_year)
    cy.contains(transcript1Mock.semester)
    unmount()
  })

  it('can details each transcript', () => {
    cy.get('body')
    cy.intercept('GET', `/students/${student1Mock.id}/transcripts?page=1&page_size=10`, transcriptsMock).as('getTranscripts')
    cy.intercept('GET', `/students/${student1Mock.id}/transcripts/${transcript1Mock.id}`, transcript1Mock).as('getTranscriptById')
    cy.intercept('GET', `/students/${student1Mock.id}/transcripts/${transcript1Mock.id}/versions?page=1&page_size=10`, transcriptsVersionMock).as(
      'getTranscriptsVersions'
    )

    cy.get(':nth-child(1) > :nth-child(4) > .MuiTypography-body2 > .MuiTypography-root').click()

    cy.wait('@getTranscripts')

    cy.get('body')
    cy.contains('Semestre')
    cy.contains('Année académique')

    cy.get('.RaDatagrid-rowEven > :nth-child(5) > .MuiButtonBase-root').click()

    cy.wait('@getTranscriptsVersions')

    cy.contains(transcript1Mock.semester)
    cy.contains(transcript1Mock.academic_year)
    cy.contains(transcriptsVersion1Mock.created_by_user_role)

    cy.intercept('GET', `/students/${student1Mock.id}/transcripts/${transcript1Mock.id}/versions/${transcriptsVersion1Mock.id}/claims?page=1&page_size=10`, claimsMock).as('getClaims')


    cy.get('.RaDatagrid-rowEven > :nth-child(5) > .MuiButtonBase-root').click()

    cy.wait('@getClaims')
    
    cy.contains(claims1Mock.reason)
    cy.contains(claims1Mock.creation_datetime) 
    unmount()
  })
})
