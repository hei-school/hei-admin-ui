import {UserConnected} from "../fixtures/authentification-mocks";
import {manager1Mock} from "../fixtures/managers-mocks";
import {student1Mock} from "../fixtures/students-mocks";
import {teacher1Mock} from "../fixtures/teachers-mocks";

function assertUserInfo(user: Required<UserConnected["user"]>) {
  cy.get("#main-content")
    .should("contain", user.ref)
    .and("contain", user.last_name)
    .and("contain", user.address)
    .and("contain", user.email)
    .and("contain", user.phone);
}

describe("Authentification", () => {
  it("user should remains on login page if fails", () => {
    cy.login({
      role: "STUDENT",
      password: "bad password",
      success: false,
    });
    cy.contains("Incorrect username or password", {timeout: 15000});
  });

  it("student should lands on profile page if succeeds", () => {
    cy.login({role: "STUDENT"});
    assertUserInfo(student1Mock);
  });

  it("teacher should lands on profile page if succeeds", () => {
    cy.login({role: "TEACHER"});
    assertUserInfo(teacher1Mock);
  });

  it("manager should lands on profile page if succeeds", () => {
    cy.login({role: "MANAGER"});
    assertUserInfo(manager1Mock);
  });
});
