import { Auth } from 'aws-amplify';
import authProvider from '../../src/providers/authProvider';
import { whoamiManagerMock, whoamiStudentMock, whoamiTeacherMock } from '../../src/__tests__/mocks/responses'
import { manager1, student1, teacher1 } from '../../src/__tests__/credentials'
import { WhoamiRoleEnum } from '../../src/gen/haClient'

const sessionStub = {
  getIdToken: () => ({ getJwtToken: () => 'dummy' }),
  getAccessToken: () => ({ getJwtToken: () => 'dummy' }),
  getRefreshToken: () => ({ getToken: () => 'dummy' }),
};

const cognitoResponse = {
  signInUserSession: {
    idToken: {
      jwtToken: 'dummy',
    },
    refreshToken: {
      token: 'dummy',
    },
    accessToken: {
      jwtToken: 'dummy',
    },
  },
};
const getUserInfo = (role) => {
  const {Manager, Teacher, Student} = WhoamiRoleEnum
    switch (role) {
      case Manager:
        return {user: manager1, whoami: whoamiManagerMock}
      case Teacher:
        return {user: teacher1, whoami: whoamiTeacherMock};
      case Student:
        return {user: student1, whoami: whoamiStudentMock};
      default:
        throw new Error("Role not known")
    }
}

const loginParams = { username: 'dummy', password: 'dummy' };

Cypress.Commands.add('cognitoLogin', (role) => {
  cy.intercept('GET', `/whoami`, getUserInfo(role).whoami).as('getWhoami')
  cy.stub(Auth, 'signIn').returns(Promise.resolve(cognitoResponse));
  cy.then(async () => await authProvider.login(loginParams));
  cy.stub(Auth, 'currentSession').returns(Promise.resolve(sessionStub));
  cy.get('#username').type(getUserInfo(role).user.username)
  cy.get('#password').type(getUserInfo(role).user.password)
  cy.get('button').contains('Connexion').click()
});
