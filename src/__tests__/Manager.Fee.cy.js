import {mount, unmount} from "@cypress/react";
import {FeeTypeEnum} from "@haapi/typescript-client";
import specTitle from "cypress-sonarqube-reporter/specTitle";
import App from "../App";
import {prettyPrintMoney, statusRenderer} from "../operations/utils";
import {manager1} from "./credentials";
import {
  createPaymentMock,
  fee1Mock,
  feesMock,
  manager2,
  student1Mock,
  studentNameToBeCheckedMock,
  studentsMock,
  whoamiManagerMock,
  feesTemplatesApi,
  annual1xTemplate,
  annual9xTemplate,
} from "./mocks/responses";
import {verifyFeesWithTemplate} from "./utils";
import { getEndOfMonth } from "../operations/utils";

// /!\ TODO: create custom cypress command "getByTestid"
describe(specTitle("Manager.Fee"), () => {
  beforeEach(() => {
    mount(<App />);
    cy.intercept("GET", `/whoami`, whoamiManagerMock).as("getWhoami");
    cy.intercept("GET", `/managers/${manager2.id}`, (req) => {
      req.reply((res) => {
        res.setDelay(500);
        res.send(manager2);
      });
    }).as("getManager1");
    cy.intercept(
      "GET",
      `/fees/templates?page=1&page_size=25`,
      feesTemplatesApi
    ).as("getFeesTemplates");
    cy.intercept("GET", `/students?page=1&page_size=10`, studentsMock).as(
      "getStudents"
    );
    cy.intercept(
      "GET",
      `/students?page=1&page_size=10&last_name=${studentNameToBeCheckedMock}`,
      [student1Mock]
    ).as("getStudentsByName");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${fee1Mock.id}/payments?page=1&page_size=10`,
      []
    ).as("getPayments");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=1&page_size=10`,
      feesMock
    ).as("getFees");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${fee1Mock.id}`,
      fee1Mock
    ).as("getFee1");
    cy.intercept("POST", `/students/${student1Mock.id}/fees`, feesMock).as(
      "createFees"
    );
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock);

    cy.get("#username").type(manager1.username);
    cy.get("#password").type(manager1.password);
    cy.get("button").contains("Connexion").click();
    cy.wait("@getWhoami", {timeout: 10000});
    cy.get('[data-testid="students-menu"]').click();
    cy.get('a[href="#/students"]').click();
    cy.get("body").click(200, 0);
    cy.contains("Page : 1");
    cy.contains(`Taille : ${feesMock.length}`);
    cy.get('td input[type="checkbox"]', {timeout: 50}).should("not.exist");
    cy.get('[data-testid="menu-list-action"]').click();
    cy.get('[data-testid="add-filter"]').click();
    cy.get('[data-testid="filter-profile-last_name"]').type(
      studentNameToBeCheckedMock
    );
    cy.get('[data-testid="apply-filter"]').click();
    cy.wait("@getStudentsByName");
    cy.contains("Page : 1");
    cy.contains("Taille : 1 ");
    cy.contains(studentNameToBeCheckedMock).click();
  });

  it("can detail waiting fee", () => {
    const interceptedFeeMock = feesMock.find(
      (fee) => fee.remaining_amount === fee1Mock.remaining_amount
    );
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${interceptedFeeMock.id}`,
      interceptedFeeMock
    ).as("getFee1");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${interceptedFeeMock.id}/payments?page=1&page_size=10`,
      createPaymentMock(interceptedFeeMock)
    ).as("getPaymentsOfOneFee");
    cy.get('[aria-label="fees"]').click();
    cy.contains(student1Mock.ref);
    cy.contains(prettyPrintMoney(interceptedFeeMock.remaining_amount)).click();
    cy.get("#main-content")
      .should("contain", prettyPrintMoney(interceptedFeeMock.remaining_amount))
      .and("contain", prettyPrintMoney(interceptedFeeMock.total_amount))
      .and("contain", interceptedFeeMock.comment)
      .and("contain", statusRenderer(interceptedFeeMock.status))
      .and("contain", "Paiements");
  });

  it("cannot create fees when fields are missing", () => {
    cy.get('[aria-label="fees"]').click();
    cy.get('[data-testid="menu-list-action"]').click();
    cy.get('[data-testid="create-button"]').click();
    cy.get("@getFeesTemplates");
    cy.get('[data-testid="predefinedType"]').click();
    cy.get('.MuiList-root > [tabindex="0"]').click();
    cy.get("#isPredefinedDate").click();

    cy.contains("Enregistrer").click();
    cy.contains("Le formulaire n'est pas valide");
  });

  it("can create fees with predefined fields equals to 1 month", () => {
    cy.get('[aria-label="fees"]').click();
    cy.get('[data-testid="menu-list-action"]').click();
    cy.get('[data-testid="create-button"]').click();
    cy.wait("@getFeesTemplates");
    cy.get('[data-testid="predefinedType"]').click();
    cy.get(`[data-value="${annual1xTemplate.id}"`).click();

    cy.contains("Enregistrer").click();

    cy.wait("@createFees").then((intersection) => {
      const requestBody = intersection.request.body;

      expect(requestBody.length).to.equal(1);

      const feeToCreate = requestBody[0];
      const currentDate = new Date();
      const currentEndOfMonth = getEndOfMonth(
        currentDate.getFullYear(),
        currentDate.getMonth()
      );

      verifyFeesWithTemplate(feeToCreate, annual1xTemplate);
      expect(feeToCreate.due_datetime, currentEndOfMonth.toISOString());
      expect(feeToCreate.comment).to.equal(annual1xTemplate.name);
    });

    cy.contains("Élément créé");
  });

  it("can create fees with predefined fields equals to 9 months", () => {
    const FIRST_MONTH = 10,
      FIRST_YEAR = 2025;

    cy.get('[aria-label="fees"]').click();
    cy.get('[data-testid="menu-list-action"]').click();
    cy.get('[data-testid="create-button"]').click();
    cy.get("@getFeesTemplates");
    cy.get('[data-testid="predefinedType"]').click();
    cy.get(`[data-value="${annual9xTemplate.id}"`).click();
    cy.get('[data-testid="predefinedYear"]').clear().type(FIRST_YEAR);
    cy.get('[data-testid="predefinedMonth"]').click();
    cy.get(`[data-value=${FIRST_MONTH}]`).click();
    cy.contains("Enregistrer").click();

    cy.wait("@createFees").then((intersection) => {
      const requestBody = intersection.request.body;

      expect(requestBody.length).to.equal(annual9xTemplate.number_of_payments);

      requestBody.forEach((feesToCreate, index) => {
        /* making sure that the month will not greater than number of month (11)*/
        const is_valid_month = FIRST_MONTH + index <= 11;
        const year_value = is_valid_month ? FIRST_YEAR : FIRST_YEAR + 1;
        const month_value = is_valid_month
          ? FIRST_MONTH + index
          : FIRST_MONTH + index - 12;

        const currentEndOfMonth = getEndOfMonth(year_value, month_value);

        verifyFeesWithTemplate(feesToCreate, annual9xTemplate);
        expect(feesToCreate.due_datetime, currentEndOfMonth.toISOString());
        expect(feesToCreate.comment).to.equal(
          `${annual9xTemplate.name} (M${index + 1})`
        );
      });
    });

    cy.contains("Élément créé");
  });

  it("can create fees with manual fields", () => {
    const FIRST_DUE_DATETIME = "2022-01-12";
    const feesToCreate = {
      amount: 200_000,
      number_of_payments: 5,
      comment: "Dummy comment",
      type: FeeTypeEnum.TUITION,
      due_datetime: new Date(FIRST_DUE_DATETIME),
    };

    cy.get('[aria-label="fees"]').click();
    cy.get('[data-testid="menu-list-action"]').click();
    cy.get('[data-testid="create-button"]').click();
    cy.get('[data-testid="isPredefinedFee"]').click();

    cy.get(`#type_${feesToCreate.type}`).click();
    cy.get('[data-testid="amount"]').click().clear().type(feesToCreate.amount);
    cy.get('[data-testid="number_of_payments"]')
      .click()
      .clear()
      .type(feesToCreate.number_of_payments);
    cy.get('[data-testid="comment"]').click().clear().type(feesToCreate.comment);
    cy.get('[data-testid="isPredefinedDate"]').click();
    cy.get('[data-testid="due_datetime"]').click().type(FIRST_DUE_DATETIME);
    cy.contains("Enregistrer").click();

    cy.wait("@createFees").then((intersection) => {
      const requestBody = intersection.request.body;

      expect(requestBody.length).to.equal(feesToCreate.number_of_payments);

      requestBody.forEach((fees, index) => {
        const first_duedatetime = feesToCreate.due_datetime;
        first_duedatetime.setMonth(first_duedatetime.getMonth() + index);

        verifyFeesWithTemplate(fees, feesToCreate);
        expect(feesToCreate.due_datetime, first_duedatetime.toISOString());
        expect(fees.comment).to.be.equal(feesToCreate.comment);
      });
    });

    cy.contains("Élément créé");
  });

  it("can create fees with manual fields without writing comments", () => {
    const AMOUNT = 500_000;
    const NUMBER_OF_PAYMENTS = 5;

    cy.get('[aria-label="fees"]').click();
    cy.get('[data-testid="menu-list-action"]').click();
    cy.get('[data-testid="create-button"]').click();
    cy.get('[data-testid="isPredefinedFee"]').click();
    cy.get(`#type_${FeeTypeEnum.TUITION}`).click();
    cy.get('[data-testid="amount"]').click().type(AMOUNT);
    cy.get('[data-testid="number_of_payments"]').click().type(NUMBER_OF_PAYMENTS);

    cy.contains("Enregistrer").click();
    
    cy.wait("@createFees").then((intersection) => {
      const requestBody = intersection.request.body;

      expect(requestBody.length).to.equal(feesToCreate.number_of_payments);

      requestBody.forEach((fees, index) => {
        const first_duedatetime = feesToCreate.due_datetime;
        first_duedatetime.setMonth(first_duedatetime.getMonth() + index);

        verifyFeesWithTemplate(fees, feesToCreate);
        expect(feesToCreate.due_datetime, first_duedatetime.toISOString());
        expect(fees.comment).to.be.equal("");
      });
    });
    cy.contains("Élément créé");
  });

  afterEach(() => {
    unmount();
  });
});
