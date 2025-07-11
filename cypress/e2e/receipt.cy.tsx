import {fee1Mock, feesMock} from "../fixtures/api_mocks/fees-mocks";
import {
  createPaymentMock,
  payment1Mock,
} from "../fixtures/api_mocks/payments-mocks";
import {student1Mock, studentsMock} from "../fixtures/api_mocks/students-mocks";

describe("Student receipt", () => {
  beforeEach(() => {
    const interceptedFeeMock = feesMock.find(
      (fee) => fee.remaining_amount === fee1Mock.remaining_amount
    );
    cy.mockLogin({role: "STUDENT"});
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=1&page_size=*`,
      feesMock
    ).as("getfees");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=2&page_size=*`,
      feesMock
    ).as("getfees2");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${interceptedFeeMock!.id}`,
      interceptedFeeMock
    ).as("getFee1");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${interceptedFeeMock!.id}/payments?page=1&page_size=*`,
      createPaymentMock(interceptedFeeMock!)
    ).as("getPaymentsOfOneFee");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${interceptedFeeMock!.id}/payments?page=2&page_size=*`,
      createPaymentMock(interceptedFeeMock!)
    ).as("getPaymentsOfOneFee2");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${fee1Mock.id}/payments/${payment1Mock.id}/receipt/raw`,
      {fixture: "/students/reçu.pdf"}
    ).as("downloadReceipt");
  });

  it("Student can get receipt", () => {
    cy.get('a[href="/students/student1_id/fees"]').click();
    cy.wait("@getfees");
    cy.getByTestid(`showButton-student1_id--${feesMock[0].id}`).click({
      force: true,
    });
    cy.getByTestid("get-receipt-btn").click();
    cy.wait("@downloadReceipt").its("response.statusCode").should("eq", 200);
  });
});

describe("Manager receipt", () => {
  beforeEach(() => {
    const interceptedFeeMock = feesMock.find(
      (fee) => fee.remaining_amount === fee1Mock.remaining_amount
    );
    cy.mockLogin({role: "MANAGER"});
    cy.visit("/profile");
    cy.intercept("GET", `/students?page=1&page_size=10`, studentsMock).as(
      "getStudents"
    );
    cy.intercept("GET", `/students?page=2&page_size=10`, studentsMock).as(
      "getStudents2"
    );
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock).as(
      "getStudent1"
    );
    cy.intercept(
      "GET",
      `/students?page=1&page_size=10&first_name=${student1Mock.first_name}`,
      [student1Mock]
    ).as("getStudentsByFirstName");
    cy.intercept(
      "GET",
      `/students?page=2&page_size=10&first_name=${student1Mock.first_name}`,
      [student1Mock]
    ).as("getStudentsByFirstName2");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=1&page_size=*`,
      feesMock
    ).as("getFees");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees?page=2&page_size=*`,
      feesMock
    ).as("getFees2");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${interceptedFeeMock!.id}`,
      interceptedFeeMock
    ).as("getFee1");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${interceptedFeeMock!.id}/payments?page=1&page_size=*`,
      createPaymentMock(interceptedFeeMock!)
    ).as("getPaymentsOfOneFee");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${interceptedFeeMock!.id}/payments?page=2&page_size=*`,
      createPaymentMock(interceptedFeeMock!)
    ).as("getPaymentsOfOneFee2");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/fees/${fee1Mock.id}/payments/${payment1Mock.id}/receipt/raw`,
      {fixture: "/students/reçu.pdf"}
    ).as("downloadReceipt");
  });
  it("Manager can get student's receipt", () => {
    cy.getByTestid("students-menu").click();
    cy.get('a[href="/students"]').click();
    cy.wait("@getStudents");
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("add-filter").click();
    cy.getByTestid("filter-profile-first_name").type(student1Mock.first_name);
    cy.getByTestid("apply-filter").click();
    cy.contains(student1Mock.first_name).click();
    cy.getByTestid("fees-tab").click();
    cy.wait("@getFees");
    cy.get(
      ".manager-fee-list .RaDatagrid-clickableRow.MuiTableRow-root:nth-child(1)"
    ).click();
    cy.wait("@getFee1");
    cy.getByTestid("get-receipt-btn").click();
    cy.wait("@downloadReceipt").its("response.statusCode").should("eq", 200);
  });
});
