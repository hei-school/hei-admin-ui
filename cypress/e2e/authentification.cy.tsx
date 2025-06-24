import {student1Mock} from "../fixtures/api_mocks/students-mocks";

describe("Authentification", () => {
  it("should lands on profile page if succeeds", () => {
    cy.login({role: "STUDENT"});
    cy.getByTestid("main-content")
      .should("contain", student1Mock.ref)
      .and("contain", student1Mock.last_name)
      .and("contain", student1Mock.address)
      .and("contain", student1Mock.email)
      .and("contain", student1Mock.phone);
  });
});
