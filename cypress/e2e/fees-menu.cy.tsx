import {WhoamiRoleEnum} from "@haapi-3d601c85/typescript-client";

const mockAppBarSideEffects = () => {
  cy.intercept("GET", "/fees?page=*&page_size=500", {data: []});
  cy.intercept("GET", "/students/credit-payments*", []);
  cy.intercept("GET", "/retake_exams*", []);
};

const STUDENT_LINKS = ["/students", "/badges/scan"];
const FEE_LINKS = [
  "/credit-payments",
  "/fees-to-archive",
  "/transactions",
  "/fees",
];

// scoped to the sidebar: the same hrefs also appear in AppBar notifications
// and dashboard widgets, which stay mounted regardless of the sidebar state.
const sidebar = () => cy.get("#ha-menu");

describe("StudentsAndFeesMenus.AccessControl", () => {
  [WhoamiRoleEnum.ADMIN, WhoamiRoleEnum.MANAGER].forEach((role) => {
    it(`keeps only the student items in Étudiants and moves fee items to Frais for ${role}`, () => {
      mockAppBarSideEffects();
      cy.mockLogin({role});

      cy.getByTestid("students-menu").should("be.visible").click();
      STUDENT_LINKS.forEach((href) => {
        sidebar().find(`a[href="${href}"]`).should("exist");
      });
      FEE_LINKS.forEach((href) => {
        sidebar().find(`a[href="${href}"]`).should("not.exist");
      });

      cy.getByTestid("fees-menu").should("be.visible").click();
      FEE_LINKS.forEach((href) => {
        sidebar().find(`a[href="${href}"]`).should("exist");
      });
    });
  });
});
