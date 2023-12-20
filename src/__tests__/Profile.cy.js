import { mount } from '@cypress/react'
import App from '../App'
import { manager1 } from './credentials'
import { editedManager2, manager2, whoamiManagerMock } from './mocks/responses'
import { toUTC } from '../operations/utils'

describe('', () => {
  beforeEach(() => {
    mount(<App />)
    cy.get('#username').type(manager1.username)
    cy.get('#password').type(manager1.password)
    cy.get('button').contains('Connexion').click()

    cy.intercept('GET', `/whoami`, whoamiManagerMock).as('getWhoami')
    cy.intercept('GET', `/managers/${manager2.id}`, manager2).as('getManager1')
    cy.wait('@getWhoami', { timeout: 10000 })
  })

  it('can edit profile', () => {
    cy.contains('Profil').click()
    cy.get("[data-testid='profile-edit-button']").click()
    cy.get('#last_name').click().clear().type(editedManager2.last_name)
    cy.get('#birth_date').click().type(editedManager2.birth_date)

    cy.intercept('PUT', `/managers/${manager2.id}`, editedManager2).as('modifyProfile')

    cy.contains('Enregistrer').click()

    cy.wait('@modifyProfile').then(interceptedReq => {
      let reqBody = interceptedReq.request.body
      reqBody.entrance_datetime = toUTC(new Date(reqBody.entrance_datetime)).toISOString()
      editedManager2.entrance_datetime = toUTC(new Date(editedManager2.entrance_datetime)).toISOString()
      editedManager2.birth_date = toUTC(new Date(editedManager2.birth_date)).toISOString()
      expect(reqBody).to.deep.equal(editedManager2)
    })

    cy.contains('Élément mis à jour')
  })
})
