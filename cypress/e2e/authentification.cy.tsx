import {getStudent1Connected} from "../fixtures/api_mocks/authentification-mocks";
import {manager1Mock} from "../fixtures/api_mocks/managers-mocks";

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

  it("permits user to renew password when it is forgotten", () => {
    const {username, password} = getStudent1Connected();
    cy.intercept(
      "POST",
      "https://cognito-idp.eu-west-3.amazonaws.com/",
      (req) => {
        req.reply({
          CodeDeliveryDetails: {
            AttributeName: "email",
            DeliveryMedium: "EMAIL",
            Destination: username,
          },
        });
      }
    ).as("awsRequest");
    cy.visit("/login");
    cy.contains("Mot de passe oublié?").click();
    cy.getByTestid("mail_input").type(username);
    cy.contains("ENVOYER").click();
    cy.wait("@awsRequest");
    cy.getByTestid("code_input").type("12345678");
    cy.getByTestid("password_input").type(password.concat("&"));
    cy.getByTestid("confirm_password_input").type(password.concat("&"));

    cy.contains("RÉINITIALISER").click();
  });
});
