import {mount, unmount} from "@cypress/react";
import App from "../App";
import {manager1} from "./credentials";
import specTitle from "cypress-sonarqube-reporter/specTitle";
import {
  manager2,
  student1Mock,
  studentNameToBeCheckedMock,
  studentsMock,
  teacherNameToBeCheckedMock,
  teacher1Mock,
  teachersMock,
  whoamiManagerMock,
  createStudent,
  createdFeesForNewStudent,
  liteCreatedStudent,
  feesTemplatesApi,
  annual1xTemplate,
  annual9xTemplate,
} from "./mocks/responses";

import {
  studentRequestBodyVerification,
  assertFeeMatchesTemplate,
} from "./utils";
import {FeeTypeEnum} from "@haapi/typescript-client";

const newFirstName = "Aina herilala";
let createdStudent = {
  ...createStudent,
  id: "ajbfq-fqdfjdh-2jkg3j",
};
let updatedStudent = {
  ...student1Mock,
  first_name: newFirstName,
    coordinates: {latitude: 500000, longitude: 600000}
};

const fillEditInputs = () => {
  cy.get("#sex_F").click();
  cy.get("#phone").type(createStudent.phone);
  cy.get("#birth_date").click().type(createStudent.birth_date);
  cy.get("[data-testid='addressInput']").type(createStudent.address);
  cy.get("[data-testid='longitude-input']").type(createStudent.coordinates.longitude);
  cy.get("[data-testid='latitude-input']").type(createStudent.coordinates.latitude);
};

describe(specTitle("Manager edit students"), () => {
  beforeEach(() => {
    mount(<App />);
    cy.get("#username").type(manager1.username);
    cy.get("#password").type(manager1.password);
    cy.get("button").contains("Connexion").click();

    cy.intercept("GET", `/whoami`, whoamiManagerMock).as("getWhoami");
    cy.intercept("GET", `/managers/${manager2.id}`, (req) => {
      req.reply((res) => {
        res.setDelay(400);
        res.send(manager2);
      });
    }).as("getManager1");
    cy.intercept("GET", `/students?page=1&page_size=10`, studentsMock).as(
      "getStudentsPage1"
    );
    cy.intercept("GET", `/students?page=2&page_size=10`, studentsMock).as(
      "getStudentsPage2"
    );
    cy.intercept(
      "GET",
      `/students?page=1&page_size=10&last_name=${studentNameToBeCheckedMock}`,
      [student1Mock]
    ).as("getStudentsByName");
    cy.intercept("GET", `/teachers?page=1&page_size=10`, teachersMock).as(
      "getTeachersPage1"
    );
    cy.intercept("GET", `/teachers?page=2&page_size=10`, teachersMock).as(
      "getTeachersPage2"
    );
    cy.intercept(
      "GET",
      `/teachers?page=1&page_size=10&first_name=${teacherNameToBeCheckedMock}`,
      [teacher1Mock]
    ).as("getTeacherByName");
  });

  it("can edit students", () => {
    cy.intercept("GET", `/students/${student1Mock.id}`, student1Mock);
    cy.intercept("PUT", `/students`, [updatedStudent]).as("modifyStudent");
    cy.contains("Étudiants");
    cy.wait("@getWhoami");
    cy.wait("@getManager1");
    cy.wait("@getWhoami");
    cy.get('[data-testid="students-menu"]').click(); // Étudiants category

    cy.get('[href="#/students"]').click();
    cy.get("body").click(200, 0); //note(uncover-menu)
    cy.contains("Page : 1");
    cy.contains(`Taille : ${studentsMock.length}`);
    cy.get("button").contains("Suivant").click();
    cy.contains("Page : 2");

    cy.get('[data-testid="menu-list-action"]').click();
    cy.get('[data-testid="add-filter"]').click();
    cy.get('[data-testid="filter-profile-last_name"]').type(
      studentNameToBeCheckedMock
    );
    cy.get('[data-testid="apply-filter"]').click();
    cy.contains("Page : 1");
    cy.contains("Taille : 1");
    cy.contains(studentNameToBeCheckedMock).click();
    cy.get('a[aria-label="Éditer"]').click(); //éditer
    cy.get("#first_name").click().clear().type(newFirstName);
    cy.getByTestid("latitude-input").type(updatedStudent.coordinates.latitude);
    cy.getByTestid("longitude-input").type(updatedStudent.coordinates.longitude);

    cy.intercept(
      "GET",
      `/students?page=1&page_size=10&last_name=${studentNameToBeCheckedMock}`,
      [updatedStudent]
    ).as("getUpdatedStudent");
    cy.contains("Enregistrer").click();
    cy.wait("@modifyStudent").then((requestIntersection) => {
      let modifyStudentWithoutFeesBodyMock =
        requestIntersection.request.body[0];
      modifyStudentWithoutFeesBodyMock.first_name = newFirstName;

      expect(requestIntersection.request.body[0]).to.deep.equal(
        modifyStudentWithoutFeesBodyMock
      );

      expect(modifyStudentWithoutFeesBodyMock.coordinates).to.deep.equal(updatedStudent.coordinates);
    });
    cy.wait("@getUpdatedStudent");
    cy.contains(newFirstName);
    unmount();
  });
});

describe(specTitle("Manager creates students"), () => {
  beforeEach(() => {
    mount(<App />);
    cy.get("#username").type(manager1.username);
    cy.get("#password").type(manager1.password);
    cy.get("button").contains("Connexion").click();

    cy.intercept("GET", `/whoami`, whoamiManagerMock).as("getWhoami");
    cy.intercept("GET", `/managers/${manager2.id}`, (req) => {
      req.reply((res) => {
        res.setDelay(400);
        res.send(manager2);
      });
    }).as("getManager1");
    cy.intercept("GET", `/students?page=1&page_size=10`, studentsMock).as(
      "getStudentsPage1"
    ); cy.intercept( "GET",
      `/fees/templates?page=1&page_size=25`,
      feesTemplatesApi
    ).as("getFeesTemplates");
    cy.intercept("GET", `/students?page=2&page_size=10`, studentsMock).as(
      "getStudentsPage2"
    );
    cy.intercept("GET", `students/${createdStudent.id}`, createdStudent).as(
      "getStudent"
    );
    cy.intercept(
      "GET",
      `/students?page=1&page_size=10&last_name=${studentNameToBeCheckedMock}`,
      [student1Mock]
    ).as("getStudentsByName");
    cy.intercept("GET", `/teachers?page=1&page_size=10`, teachersMock).as(
      "getTeachersPage1"
    );
    cy.intercept("GET", `/teachers?page=2&page_size=10`, teachersMock).as(
      "getTeachersPage2"
    );
    cy.intercept(
      "GET",
      `/teachers?page=1&page_size=10&first_name=${teacherNameToBeCheckedMock}`,
      [teacher1Mock]
    ).as("getTeacherByName");

    cy.contains("Enseignants");
    cy.wait("@getWhoami");
    cy.contains("Étudiants");

    cy.wait("@getManager1");
    cy.get('[data-testid="students-menu"]').click(); // Étudiants category

    cy.get('[href="#/students"]').click();
    cy.get("body").click(200, 0); //note(uncover-menu)
    cy.contains("Page : 1");
    cy.contains(`Taille : ${studentsMock.length}`);
    cy.get('[data-testid="menu-list-action"]').click();
    cy.get('[data-testid="create-button"]').click();
    cy.intercept("PUT", "/students", [createdStudent]).as("createStudent");
    cy.intercept("POST", `students/${createdStudent.id}/fees`, [
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
      "/students?page=1&page_size=10",
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
      "/students?page=1&page_size=10",
      [createdStudent, ...studentsMock].slice(0, 10)
    ).as("getStudents");
    cy.contains("Enregistrer").click();
    cy.wait("@createStudent").then((requestInterception) =>
      studentRequestBodyVerification(requestInterception.request.body, {
        ...liteCreatedStudent, coordinates: {longitude: 0, latitude: 0}
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
      "/students?page=1&page_size=10",
      [...studentsMock, createdStudent].slice(0, 10)
    ).as("getStudents");
    cy.get('[data-testid="predefinedType"]').click();
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
    cy.get('[data-testid="predefinedType"]').click();
    cy.get(`[data-value="${annual9xTemplate.id}"]`).click();

    cy.intercept(
      "GET",
      "/students?page=1&page_size=10",
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

      requestBody.forEach((feesToCreate, index) => {
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

    cy.get('[data-testid="isPredefinedFee"]').click();
    cy.get(`#type_${FeeTypeEnum.TUITION}`).click();
    cy.get('[data-testid="amount"]').click().clear().type(AMOUNT);
    cy.get('[data-testid="number_of_payments"]')
      .click()
      .clear()
      .type(NUMBER_OF_PAYEMENTS);
    cy.get('[data-testid="comment"]').click().type(COMMENT);
    cy.get('[data-testid="isPredefinedDate"]').click();
    cy.get('[data-testid="due_datetime"]').click().type(DUEDATETIME);

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

  afterEach(() => {
    unmount();
  });
});
