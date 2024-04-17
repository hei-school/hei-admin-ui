import {manager1Mock} from "../fixtures/managers-mocks";

describe("Authentification", () => {
  it("user should remains on login page if fails", () => {
    cy.login({
      role: "STUDENT",
      password: "bad password",
      success: false,
    });
    cy.contains("Incorrect username or password", {timeout: 15000});
  });

  it("should lands on profile page if succeeds", () => {
    cy.login({role: "MANAGER"});
    cy.getByTestid("main-content")
      .should("contain", manager1Mock.ref)
      .and("contain", manager1Mock.last_name)
      .and("contain", manager1Mock.address)
      .and("contain", manager1Mock.email)
      .and("contain", manager1Mock.phone);
  });
});
