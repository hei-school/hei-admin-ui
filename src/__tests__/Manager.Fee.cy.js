import { mount, unmount } from "@cypress/react";
import specTitle from "cypress-sonarqube-reporter/specTitle";
import App from "../App";
import { prettyPrintMoney, statusRenderer, toUTC } from "../operations/utils";
import { manager1 } from "./credentials";
import {
  addFeeMock,
  createFeeWithManualDataMock,
  createFeeWithPredefinedDataMock,
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
  annual9xTemplate
} from "./mocks/responses";
import { getEndOfMonth, testDateWithoutTime } from "./utils";

const feeDateToSearch = `2022-09-11`;
const feeCreatDate = "date2";

const testPredefinedFees = (feesToCreate, template, endOfMonth)=>{
  expect(feesToCreate.total_amount).to.equal(annual1xTemplate.amount);
  expect(feesToCreate.type).to.equal(annual1xTemplate.type);
  testDateWithoutTime(feesToCreate.due_datetime, endOfMonth.toISOString());
  testDateWithoutTime(feesToCreate.creation_datetime, currentDate.toISOString());
}

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
    cy.intercept("GET", `/fees/templates?page=1&page_size=25`, feesTemplatesApi).as(
      "getFeesTemplates"
    );
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
    cy.intercept(
      "POST",
      `/students/${student1Mock.id}/fees`,
      feesMock
    ).as("createFees");
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock);
    
    cy.get("#username").type(manager1.username);
    cy.get("#password").type(manager1.password);
    cy.get("button").contains("Connexion").click();
    cy.wait("@getWhoami", { timeout: 10000 });
    cy.get('[data-testid="students-menu"]').click();
    cy.get('a[href="#/students"]').click();
    cy.get("body").click(200, 0);
    cy.contains("Page : 1");
    cy.contains(`Taille : ${feesMock.length}`);
    cy.get('td input[type="checkbox"]', { timeout: 50 }).should("not.exist");
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

  //NOTE: This test should pass
  // it("can detail waiting fee", () => {
  //   const interceptedFeeMock = feesMock.find(
  //     (fee) => fee.remaining_amount === fee1Mock.remaining_amount
  //   );
  //   cy.intercept(
  //     "GET",
  //     `/students/${student1Mock.id}/fees/${interceptedFeeMock.id}`,
  //     interceptedFeeMock
  //   ).as("getFee1");
  //   cy.intercept(
  //     "GET",
  //     `/students/${student1Mock.id}/fees/${interceptedFeeMock.id}/payments?page=1&page_size=10`,
  //     createPaymentMock(interceptedFeeMock)
  //   ).as("getPaymentsOfOneFee");
  //   cy.get('[aria-label="fees"]').click();
  //   cy.contains(student1Mock.ref);
  //   cy.contains(prettyPrintMoney(interceptedFeeMock.remaining_amount)).click();
  //   cy.get("#main-content")
  //     .should("contain", prettyPrintMoney(interceptedFeeMock.remaining_amount))
  //     .and("contain", prettyPrintMoney(interceptedFeeMock.total_amount))
  //     .and("contain", interceptedFeeMock.comment)
  //     .and("contain", statusRenderer(interceptedFeeMock.status))
  //     .and("contain", "Paiements");
  //   unmount();
  // });

  //NOTE: passed
  // it("cannot create fees when fields are missing", () => {
  //   cy.get('[aria-label="fees"]').click();
  //   cy.get('[data-testid="menu-list-action"]').click();
  //   cy.get('[data-testid="create-button"]').click();
  //   cy.get('@getFeesTemplates')
  //   cy.get("#predefined_type").click();
  //   cy.get('.MuiList-root > [tabindex="0"]').click();
  //   cy.get("#isPredefinedDate").click();
  //   cy.contains("Enregistrer").click();
  //   cy.contains("Le formulaire n'est pas valide");
  //   unmount();
  // });
  
  it("can create fees with predefined fields", () => {
    cy.get('[aria-label="fees"]').click();
    cy.get('[data-testid="menu-list-action"]').click();
    cy.get('[data-testid="create-button"]').click();
    cy.get('@getFeesTemplates')
    cy.get("#predefined_type").click();
    cy.get(`[data-value="${annual1xTemplate.id}"`).click();

    cy.contains("Enregistrer").click();

    cy.wait("@createFees").then((intersection) => {
      const requestBody = intersection.request.body;

      expect(requestBody.length).to.equal(1);

      const feesToCreate = requestBody[0];
      const currentDate = new Date();
      const currentEndOfMonth = getEndOfMonth(currentDate.getFullYear(), currentDate.getMonth());

      testPredefinedFees(feesToCreate, annual9xTemplate, currentEndOfMonth);
      expect(feesToCreate.comment).to.equal(annual1xTemplate.name);
    });

    cy.contains("Élément créé");
  });

  it("can create fees with predefined fields equals to 9 months", () => {
    const FIRST_MONTH = 10 , FIRST_YEAR = 2025;
    
    cy.get('[aria-label="fees"]').click();
    cy.get('[data-testid="menu-list-action"]').click();
    cy.get('[data-testid="create-button"]').click();
    cy.get('@getFeesTemplates')
    cy.get("#predefined_type").click();
    cy.get(`[data-value="${annual9xTemplate.id}"`).click();
    cy.get('#predefinedYear').type(FIRST_YEAR);
    cy.get('#predefinedMonth');
    cy.get(`[data-value=${FIRST_MONTH}]`).click()
    cy.contains("Enregistrer").click();

    cy.wait("@createFees").then((intersection) => {
      const requestBody = intersection.request.body;
      
      expect(requestBody.length).to.equal(annual1xTemplate.number_of_payments);
      
      requestBody.foreach((feesToCreate, index)=>{
        /* making sure that the month will not greater than 11 */
        const is_valid_month = FIRST_MONTH + index <= 11; 
        const year_value = is_valid_month ? FIRST_YEAR + 1 : FIRST_YEAR;
        const month_value = is_valid_month ? FIRST_MONTH + index : 0;

        const currentEndOfMonth = getEndOfMonth(year_value, month_value);
        testPredefinedFees(feesToCreate, annual9xTemplate, currentEndOfMonth);
        expect(feesToCreate.comment).to.equal(`${annual1xTemplate.name} (M${index + 1})`);
      })
    });

    cy.contains("Élément créé");
  });

  // it("can create fees with manual fields", () => {
  //   const monthlyAmount = 200000;
  //   const monthsNumber = 5;
  //   const comment = "Dummy comment";
  //   const manuallyCreatedFees = createFeeWithManualDataMock(
  //     feeDateToSearch,
  //     monthlyAmount,
  //     comment,
  //     monthsNumber
  //   );
  //   cy.intercept(
  //     "POST",
  //     `/students/${student1Mock.id}/fees`,
  //     manuallyCreatedFees
  //   ).as("createFees");
  //   cy.get('[aria-label="fees"]').click();
  //   cy.get('[data-testid="menu-list-action"]').click();
  //   cy.get('[data-testid="create-button"]').click();
  //   cy.get("#is_predefined_type").click();
  //   cy.get("#manual_type_tuition").click();
  //   cy.get("#monthly_amount").click().clear().type(monthlyAmount);

  //   cy.get("#months_number").click().clear().type(monthsNumber);

  //   cy.get("#comment").click().clear().type(comment);

  //   cy.get("#is_predefined_first_dueDate").click();
  //   cy.get("#manual_first_duedate").click().type(feeDateToSearch);

  //   cy.intercept(
  //     "GET",
  //     `/students/${student1Mock.id}/fees?page=1&page_size=10`,
  //     addFeeMock(feesMock, manuallyCreatedFees)
  //   ).as("getFees");
  //   cy.contains("Enregistrer").click();
  //   cy.contains("Élément créé");
  //   unmount();
  // });
  // it("can create fees with manual fields without writing comments", () => {
  //   const monthlyAmount = 1 + Math.floor(Math.random() * 2_000_000);
  //   const monthsNumber = 1 + Math.floor(Math.random() * 3);
  //   const manuallyCreatedFees = createFeeWithManualDataMock(
  //     feeDateToSearch,
  //     monthlyAmount,
  //     null,
  //     monthsNumber
  //   );
  //   cy.intercept(
  //     "GET",
  //     `/students/${student1Mock.id}/fees?page=1&page_size=10`,
  //     feesMock
  //   ).as("getFees");
  //   cy.intercept(
  //     "POST",
  //     `/students/${student1Mock.id}/fees`,
  //     manuallyCreatedFees
  //   );
  //   cy.get('[aria-label="fees"]').click();
  //   cy.get('[data-testid="menu-list-action"]').click();
  //   cy.get('[data-testid="create-button"]').click();
  //   cy.get("#is_predefined_type").click();
  //   cy.get("#manual_type_tuition").click();
  //   cy.get("#monthly_amount").click().type(monthlyAmount);

  //   cy.get("#months_number").click().type(monthsNumber);

  //   cy.get("#is_predefined_first_dueDate").click();
  //   cy.get("#manual_first_duedate").click().type(feeDateToSearch);

  //   cy.intercept(
  //     "GET",
  //     `/students/${student1Mock.id}/fees?page=1&page_size=10`,
  //     addFeeMock(feesMock, manuallyCreatedFees)
  //   ).as("getFees");
  //   cy.contains("Enregistrer").click();
  //   cy.contains("Élément créé");
  //   cy.contains("-");
  //   unmount();
  // });
  
  afterEach(() => {
    unmount()
  });
});
