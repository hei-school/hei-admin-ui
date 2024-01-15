import {mount, unmount} from "@cypress/react";
import App from "../App";
import {student1} from "./credentials";
import specTitle from "cypress-sonarqube-reporter/specTitle";
import {student1Mock, whoamiStudentMock} from "./mocks/responses";

const FILE_NAME = "Cetificat_scolarité.pdf";

describe(
  specTitle("Student and Manager Can get a certificate for students"),
  () => {
    beforeEach(() => {
      mount(<App />);
      cy.get("#username").type(student1.username);
      cy.get("#password").type(student1.password);
      cy.get("button").contains("Connexion").click();
      cy.intercept("GET", `/whoami`, whoamiStudentMock).as("getWhoami");
      cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock).as(
        "getStudent1"
      );
      cy.wait("@getWhoami");
      cy.get("body").click();
    });
    it("can edit students", () => {
      cy.intercept(
        "GET",
        `/students/${student1Mock.id}/scholarship_certificate/raw`,
        {fixture: "students/certificate.pdf"}
      ).as("downloadCertificate");
      cy.get('[data-testid="get-certificate-btn"]').click();
      cy.wait("@downloadCertificate");
      cy.get('[data-testid="certificate-link"]')
        .should("not.be.visible")
        .and("have.attr", "href")
        .and("include", "blob");
      unmount();
    });
  }
);
