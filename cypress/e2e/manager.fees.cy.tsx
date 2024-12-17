import {FeeTypeEnum} from "@haapi/typescript-client";
import {assertFeeMatchesTemplate} from "./utils";
import {
  annual1xTemplate,
  annual9xTemplate,
  feesTemplatesMocks,
} from "../fixtures/api_mocks/fees-templates-mocks";
import {student1Mock, studentsMock} from "../fixtures/api_mocks/students-mocks";
import {fee1Mock, feesMock} from "../fixtures/api_mocks/fees-mocks";
import {createPaymentMock} from "../fixtures/api_mocks/payments-mocks";

/*Added this to make the test blackbox */
const get27thOfMonth = (year: number, month: number) => {
  return new Date(year, month, 27);
};

describe("Manager.Fee", () => {
  beforeEach(() => {
    cy.intercept(
      "GET",
      `*/fees/templates?page=1&page_size=25`,
      feesTemplatesMocks
    ).as("getFeesTemplates");
    cy.intercept("GET", `*/students?page=1&page_size=10`, studentsMock).as(
      "getStudents"
    );
    cy.intercept(
      "GET",
      `*/students?page=1&page_size=10&first_name=${student1Mock.first_name}`,
      [student1Mock]
    ).as("getStudentsByName");
    cy.intercept(
      "GET",
      `*/students/${student1Mock.id}/fees/${fee1Mock.id}/payments?page=1&page_size=10`,
      []
    ).as("getPayments");
    cy.intercept(
      "GET",
      `*/students/${student1Mock.id}/fees?page=1&page_size=10`,
      feesMock
    ).as("getFees");
    cy.intercept(
      "GET",
      `*/students/${student1Mock.id}/fees/${fee1Mock.id}`,
      fee1Mock
    ).as("getFee1");
    cy.intercept("PUT", `*/fees`, feesMock).as("createFees");
    cy.intercept("GET", `*/students/${student1Mock.id}`, student1Mock);

    cy.login({role: "MANAGER"});
    cy.getByTestid("students-menu").click();
    cy.get('a[href="#/students"]').click();
    cy.get("body").click(200, 0);
    cy.contains("Page : 1");
    cy.contains(`Taille : ${feesMock.length > 10 ? 10 : feesMock.length}`);
    cy.get('td input[type="checkbox"]', {timeout: 50}).should("not.exist");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("add-filter").click();
    cy.getByTestid("filter-profile-first_name").type(student1Mock.first_name);
    cy.getByTestid("apply-filter").click();
    cy.wait("@getStudentsByName");
    cy.contains("Page : 1");
    cy.contains("Taille : 1 ");
    cy.contains(student1Mock.first_name).click();
  });

  it("can detail waiting fee", () => {
    const interceptedFeeMock = feesMock.find(
      (fee) => fee.remaining_amount === fee1Mock.remaining_amount
    );
    cy.intercept(
      "GET",
      `*/students/${student1Mock.id}/fees/${interceptedFeeMock!.id}`,
      interceptedFeeMock
    ).as("getFee1");
    cy.intercept(
      "GET",
      `*/students/${student1Mock.id}/fees/${interceptedFeeMock!.id}/payments?page=1&page_size=10`,
      createPaymentMock(interceptedFeeMock!)
    ).as("getPaymentsOfOneFee");
    cy.get('[data-testid="fees-list-tab"]').click();
    cy.wait("@getFees");
    cy.get("#main-content tbody tr").first().click();
    cy.wait("@getFee1");
    cy.get("#main-content")
      .should("contain", `${interceptedFeeMock!.remaining_amount!} Ar`)
      .and("contain", `${interceptedFeeMock!.total_amount!} Ar`)
      .and("contain", interceptedFeeMock!.comment!)
      .and("contain", "Paiements");
  });

  it("cannot create fees when fields are missing", () => {
    cy.get('[data-testid="fees-list-tab"]').click();
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    cy.wait("@getFeesTemplates");
    cy.getByTestid("predefinedType").click();
    cy.get('.MuiList-root > [tabindex="0"]').click();
    cy.get("#isPredefinedDate").click();

    cy.contains("Enregistrer").click();
    cy.contains("Le formulaire n'est pas valide");
  });

  it("can create fees with predefined fields equals to 1 month", () => {
    cy.intercept("PUT", `*/fees*`, feesMock).as("createFees");
    cy.get('[data-testid="fees-list-tab"]').click();
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    cy.wait("@getFeesTemplates");
    cy.getByTestid("predefinedType").click();
    cy.get(`[data-value="${annual1xTemplate.id}"`).click();

    cy.contains("Enregistrer").click();

    cy.wait("@createFees").then((intersection) => {
      const requestBody = intersection.request.body;

      expect(requestBody.length).to.equal(1);

      const feeToCreate = requestBody[0];
      const currentDate = new Date();
      const currentEndOfMonth = get27thOfMonth(
        currentDate.getFullYear(),
        currentDate.getMonth()
      );

      assertFeeMatchesTemplate(feeToCreate, annual1xTemplate);
      expect(feeToCreate.due_datetime, currentEndOfMonth.toISOString());
      expect(feeToCreate.comment).to.equal(annual1xTemplate.name);
    });

    cy.contains("Élément créé");
  });

  it("can create fees with predefined fields equals to 9 months", () => {
    const FIRST_MONTH = 10,
      FIRST_YEAR = 2025;

    cy.get('[data-testid="fees-list-tab"]').click();
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    cy.wait("@getFeesTemplates");
    cy.getByTestid("predefinedType").click();
    cy.get(`[data-value="${annual9xTemplate.id}"`).click();

    cy.getByTestid("predefinedYear").click().clear().type("2025");
    cy.getByTestid("predefinedMonth").click();
    cy.get(`[data-value=${FIRST_MONTH}]`).click();
    cy.contains("Enregistrer").click();

    cy.wait("@createFees").then((intersection) => {
      const requestBody = intersection.request.body;

      expect(requestBody.length).to.equal(annual9xTemplate.number_of_payments);

      requestBody.forEach((feeToCreate: any, index: number) => {
        /* making sure that the month will not greater than number of month (11) */
        const is_valid_month = FIRST_MONTH + index <= 11;
        const year_value = is_valid_month ? FIRST_YEAR : FIRST_YEAR + 1;
        const month_value = is_valid_month
          ? FIRST_MONTH + index
          : FIRST_MONTH + index - 12;

        const currentEndOfMonth = get27thOfMonth(year_value, month_value);

        assertFeeMatchesTemplate(feeToCreate, annual9xTemplate);
        expect(feeToCreate.due_datetime, currentEndOfMonth.toISOString());
        expect(feeToCreate.comment).to.equal(
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

    cy.get('[data-testid="fees-list-tab"]').click();
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    cy.getByTestid("isPredefinedFee").click();

    cy.get(`#type_${feesToCreate.type}`).click();
    cy.getByTestid("amount")
      .click()
      .clear()
      .type(feesToCreate.amount.toString());
    cy.getByTestid("number_of_payments")
      .click()
      .clear()
      .type(feesToCreate.number_of_payments.toString());
    cy.getByTestid("comment").click().clear().type(feesToCreate.comment);
    cy.getByTestid("isPredefinedDate").click();
    cy.getByTestid("due_datetime").click().type(FIRST_DUE_DATETIME);
    cy.contains("Enregistrer").click();

    cy.wait("@createFees").then((intersection) => {
      const requestBody = intersection.request.body;

      expect(requestBody.length).to.equal(feesToCreate.number_of_payments);

      requestBody.forEach((fees: any, index: any) => {
        const first_duedatetime = feesToCreate.due_datetime;
        first_duedatetime.setMonth(first_duedatetime.getMonth() + index);

        assertFeeMatchesTemplate(fees, feesToCreate);
        expect(feesToCreate.due_datetime, first_duedatetime.toISOString());
        expect(fees.comment).to.be.equal(feesToCreate.comment);
      });
    });

    cy.contains("Élément créé");
  });

  it("can create fees with manual fields without writing comments", () => {
    const feesToCreate = {
      amount: 500_000,
      number_of_payments: 2,
      comment: "Dummy comment",
      type: FeeTypeEnum.HARDWARE,
    };

    cy.get('[data-testid="fees-list-tab"]').click();
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    cy.getByTestid("isPredefinedFee").click();
    cy.get(`#type_${FeeTypeEnum.HARDWARE}`).click();
    cy.getByTestid("amount").click().type(feesToCreate.amount.toString());
    cy.getByTestid("number_of_payments")
      .click()
      .type(feesToCreate.number_of_payments.toString());

    cy.contains("Enregistrer").click();

    cy.wait("@createFees").then((intersection) => {
      const requestBody = intersection.request.body;

      expect(requestBody.length).to.equal(feesToCreate.number_of_payments);
      requestBody.forEach((fees: any) => {
        assertFeeMatchesTemplate(fees, feesToCreate);
      });
    });

    cy.contains("Élément créé");
  });
});
