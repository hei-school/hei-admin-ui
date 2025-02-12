import {student1Mock} from "../fixtures/api_mocks/students-mocks";

describe("Authentification", () => {
  it("user should remains on login page if fails", () => {
    cy.login({
      role: "STUDENT",
      password: "bad password",
      success: false,
    });
    cy.contains("CONNEXION AVEC CASDOOR", {timeout: 15000});
  });

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
