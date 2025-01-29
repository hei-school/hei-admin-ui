import {FeeTypeEnum} from "@haapi/typescript-client";
import {createdFeesForNewStudent} from "../fixtures/api_mocks/fees-mocks";
import {
  annual1xTemplate,
  annual9xTemplate,
  feesTemplatesMocks,
} from "../fixtures/api_mocks/fees-templates-mocks";
import {
  createStudent,
  liteCreatedStudent,
  student1Mock,
  studentsMock,
} from "../fixtures/api_mocks/students-mocks";
import {
  teacher1Mock,
  teacherNameToBeCheckedMock,
  teachersMock,
} from "../fixtures/api_mocks/teachers-mocks";
import {
  assertFeeMatchesTemplate,
  studentRequestBodyVerification,
} from "./utils";

const newFirstName = "Aina herilala";
let createdStudent = {
  ...createStudent,
  id: "ajbfq-fqdfjdh-2jkg3j",
};
let updatedStudent = {
  ...student1Mock,
  first_name: newFirstName,
  coordinates: {latitude: 500000, longitude: 600000},
};

const fillEditInputs = () => {
  cy.get("#sex_F").click();
  cy.get("#phone").type(createStudent.phone);
  cy.get("#birth_date").click().type(createStudent.birth_date);
  cy.getByTestid("addressInput").type(createStudent.address);
  cy.getByTestid("longitude-input").type(
    createStudent.coordinates.longitude!.toString()
  );
  cy.getByTestid("latitude-input").type(
    createStudent.coordinates.latitude!.toString()
  );
};

describe("Manager edit students", () => {
  beforeEach(() => {
    cy.login({role: "MANAGER"});
    cy.intercept("GET", `*/students?page=1&page_size=10`, studentsMock).as(
      "getStudentsPage1"
    );
    cy.intercept("GET", `*/students?page=2&page_size=10`, studentsMock).as(
      "getStudentsPage2"
    );
    cy.intercept(
      "GET",
      `*/students?page=1&page_size=10&first_name=${student1Mock.first_name}`,
      [student1Mock]
    ).as("getStudentsByFirstName");
    cy.intercept("GET", `*/teachers?page=1&page_size=10`, teachersMock).as(
      "getTeachersPage1"
    );
    cy.intercept("GET", `*/teachers?page=2&page_size=10`, teachersMock).as(
      "getTeachersPage2"
    );
    cy.intercept(
      "GET",
      `*/teachers?page=1&page_size=10&first_name=${teacherNameToBeCheckedMock}`,
      [teacher1Mock]
    ).as("getTeacherByFirstName");
  });

  it("can edit students", () => {
    cy.intercept("GET", `*/students/${student1Mock.id}`, student1Mock);
    cy.intercept("PUT", `*/students/${student1Mock.id}`, updatedStudent).as(
      "modifyStudent"
    );
    cy.contains("Étudiants");
    cy.getByTestid("students-menu").click(); // Étudiants category

    cy.get('[href="#/students"]').click();
    cy.get("body").click(200, 0); //note(uncover-menu)
    cy.contains("Page : 1");
    cy.contains(`Taille : ${studentsMock.length}`);
    cy.get("button").contains("Suivant").click();
    cy.contains("Page : 2");

    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("add-filter").click();
    cy.getByTestid("filter-profile-first_name").type(student1Mock.first_name);
    cy.getByTestid("apply-filter").click();
    cy.contains("Page : 1");
    cy.contains("Taille : 1");
    cy.contains(student1Mock.first_name).click();
    cy.get('[aria-label="Éditer"]').click(); //éditer
    cy.get("#first_name").click().clear().type(newFirstName);
    cy.getByTestid("latitude-input").type(
      updatedStudent.coordinates.latitude.toString() as string
    );
    cy.getByTestid("longitude-input").type(
      updatedStudent.coordinates.longitude.toString()
    );

    cy.intercept(
      "GET",
      `*/students?page=1&page_size=10&first_name=${student1Mock.first_name}`,
      [updatedStudent]
    ).as("getUpdatedStudent");
    cy.contains("Enregistrer").click();
    cy.wait("@modifyStudent").then((requestIntersection) => {
      let modifyStudentWithoutFeesBodyMock = requestIntersection.request.body;
      modifyStudentWithoutFeesBodyMock.first_name = newFirstName;

      expect(requestIntersection.request.body).to.deep.equal(
        modifyStudentWithoutFeesBodyMock
      );

      expect(modifyStudentWithoutFeesBodyMock.coordinates).to.deep.equal(
        updatedStudent.coordinates
      );
    });
  });
});

describe("Manager creates students", () => {
  beforeEach(() => {
    cy.login({role: "MANAGER"});
    cy.intercept("GET", `*/students?page=1&page_size=10`, studentsMock).as(
      "getStudentsPage1"
    );
    cy.intercept(
      "GET",
      `*/fees/templates?page=1&page_size=25`,
      feesTemplatesMocks
    ).as("getFeesTemplates");
    cy.intercept("GET", `*/students?page=2&page_size=10`, studentsMock).as(
      "getStudentsPage2"
    );
    cy.intercept("GET", `*/students/${createdStudent.id}`, createdStudent).as(
      "getStudent"
    );
    cy.intercept(
      "GET",
      `*/students?page=1&page_size=10&first_name=${student1Mock.first_name}`,
      [student1Mock]
    ).as("getStudentsByFirstName");
    cy.intercept("GET", `*/teachers?page=1&page_size=10`, teachersMock).as(
      "getTeachersPage1"
    );
    cy.intercept("GET", `*/teachers?page=2&page_size=10`, teachersMock).as(
      "getTeachersPage2"
    );
    cy.intercept(
      "GET",
      `*/teachers?page=1&page_size=10&first_name=${teacherNameToBeCheckedMock}`,
      [teacher1Mock]
    ).as("getTeacherByFirstName");
    cy.contains("Enseignants");
    cy.contains("Étudiants");
    cy.getByTestid("students-menu").click(); // Étudiants category

    cy.get('[href="#/students"]').click();
    cy.get("body").click(200, 0); //note(uncover-menu)
    cy.contains("Page : 1");
    cy.contains(`Taille : ${studentsMock.length}`);
    cy.getByTestid("menu-list-action").click();
    cy.getByTestid("create-button").click();
    cy.intercept("PUT", "*/students", [createdStudent]).as("createStudent");
    cy.intercept("POST", `*/students/${createdStudent.id}/fees`, [
      createdFeesForNewStudent,
    ]).as("createFees");
    cy.get("#ref").type(createStudent.ref);
    cy.get("#first_name").type(createStudent.first_name);
    cy.get("#last_name").type(createStudent.last_name);
    cy.get("#nic").type(createStudent.nic);
    cy.get("#birth_place").type(createStudent.birth_place);
    cy.get("#entrance_datetime")
      .click()
      .type(createStudent.entrance_datetime.toISOString().slice(0, 10));
    cy.get("#email").type(createStudent.email);
  });
  it("can create students without fees", () => {
    cy.intercept(
      "GET",
      "*/students?page=1&page_size=10",
      [createdStudent, ...studentsMock].slice(0, 10)
    ).as("getStudents");
    fillEditInputs();
    cy.contains("Enregistrer").click();
    cy.wait("@createStudent").then((requestInterseption) =>
      studentRequestBodyVerification(requestInterseption.request.body, {
        ...createStudent,
      })
    );
    cy.contains("Élément créé");
  });

  it("can create students with only ref, firstname, lastname and entranceDatetime", () => {
    cy.intercept(
      "GET",
      "*/students?page=1&page_size=10",
      [createdStudent, ...studentsMock].slice(0, 10)
    ).as("getStudents");
    cy.contains("Enregistrer").click();
    cy.wait("@createStudent").then((requestInterception) =>
      studentRequestBodyVerification(requestInterception.request.body, {
        ...liteCreatedStudent,
        coordinates: {longitude: 0, latitude: 0},
      })
    );
    cy.contains("Élément créé");
  });

  it("can create student with his/her fees using predefined fees", () => {
    fillEditInputs();
    cy.get(
      ".MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input"
    ).click();
    cy.intercept(
      "GET",
      "*/students?page=1&page_size=10",
      [...studentsMock, createdStudent].slice(0, 10)
    ).as("getStudents");
    cy.getByTestid("predefinedType").click();
    cy.get(`[data-value="${annual1xTemplate.id}"]`).click();

    cy.contains("Enregistrer").click();

    cy.wait("@createStudent").then((requestInterseption) =>
      studentRequestBodyVerification(requestInterseption.request.body, {
        ...createStudent,
      })
    );

    cy.wait("@createFees").then((intersection) => {
      const requestBody = intersection.request.body;

      expect(requestBody.length).to.equal(1);
      assertFeeMatchesTemplate(requestBody[0], annual1xTemplate);
    });

    cy.contains("Élément créé");
  });

  it("can create student with his/her 9 months fees", () => {
    fillEditInputs();
    cy.get(
      ".MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input"
    ).click();
    cy.getByTestid("predefinedType").click();
    cy.get(`[data-value="${annual9xTemplate.id}"]`).click();

    cy.intercept(
      "GET",
      "*/students?page=1&page_size=10",
      [...studentsMock, createdStudent].slice(0, 10)
    ).as("getStudents");
    cy.intercept("POST", `students/${createdStudent.id}/fees`, [
      createdFeesForNewStudent,
    ]).as("createFees");

    cy.contains("Enregistrer").click();

    cy.wait("@createStudent").then((requestInterseption) =>
      studentRequestBodyVerification(requestInterseption.request.body, {
        ...createStudent,
      })
    );

    cy.wait("@createFees").then((intersection) => {
      const requestBody = intersection.request.body;

      expect(requestBody.length).to.equal(annual9xTemplate.number_of_payments);

      requestBody.forEach((feesToCreate: any, index: any) => {
        assertFeeMatchesTemplate(feesToCreate, annual9xTemplate);
        expect(feesToCreate.comment).to.equal(
          `${annual9xTemplate.name} (M${index + 1})`
        );
      });
    });

    cy.contains("Élément créé");
  });

  it("can create student with his/her fees manually", () => {
    const AMOUNT = 300_000;
    const NUMBER_OF_PAYEMENTS = 4;
    const DUEDATETIME = "2022-10-05";
    const COMMENT = "Dummy comment";

    fillEditInputs();
    cy.get(
      ".MuiSwitch-root > .MuiButtonBase-root > .PrivateSwitchBase-input"
    ).click();

    cy.getByTestid("isPredefinedFee").click();
    cy.get(`#type_${FeeTypeEnum.TUITION}`).click();
    cy.getByTestid("amount").click().clear().type(AMOUNT.toString());
    cy.getByTestid("number_of_payments")
      .click()
      .clear()
      .type(NUMBER_OF_PAYEMENTS.toString());
    cy.getByTestid("comment").click().type(COMMENT);
    cy.getByTestid("isPredefinedDate").click();
    cy.getByTestid("due_datetime").click().type(DUEDATETIME);

    cy.contains("Enregistrer").click();

    cy.wait("@createStudent").then((requestInterseption) =>
      studentRequestBodyVerification(requestInterseption.request.body, {
        ...createStudent,
      })
    );

    cy.wait("@createFees").then((requestIntersection) => {
      expect(requestIntersection.request.body.length).to.equal(
        NUMBER_OF_PAYEMENTS
      );
    });

    cy.contains("Élément créé");
  });
});
