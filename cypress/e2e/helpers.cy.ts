import {asWindowFunction} from "./utils";

// Signatures as seen by these tests.
type GradeRow = {grade: {score: number | null}; id: string; name: string};
type ValidateGradeData = (data: object[]) => unknown;
type TransformGradesData = (data: object[]) => [unknown, GradeRow[]][];
type GetCurrentWeekRange = (currentDate?: Date) => {
  monday: string | Date;
  saturday: string | Date;
};

describe("Grades Data Utils coverage", () => {
  // TODO: fix this test
  it.skip("should cover validateGradeData and transformGradesData", () => {
    cy.visit("/");

    cy.window().then((win) => {
      expect(win).to.have.property("validateGradeData");
      expect(win).to.have.property("transformGradesData");
      const validateGradeData = asWindowFunction<ValidateGradeData>(
        win.validateGradeData
      );
      const transformGradesData = asWindowFunction<TransformGradesData>(
        win.transformGradesData
      );

      const data = [
        {"grade.score": 15, "id": "student1", "name": "Alice"},
        {"grade.score": null, "id": "student2", "name": "Bob"},
      ];

      const transformed = transformGradesData(data);
      expect(transformed).to.have.length(1);
      expect(transformed[0][1]).to.have.length(2);

      expect(transformed[0][1][0].grade.score).to.eq(15);
      expect(transformed[0][1][0].id).to.eq("student1");
      expect(transformed[0][1][0].name).to.eq("Alice");

      expect(transformed[0][1][1].grade.score).to.eq(0);
      expect(transformed[0][1][1].id).to.eq("student2");

      const valid = validateGradeData(data);
      expect(valid).to.exist;
    });
  });
});

describe("getCurrentWeekRange coverage", () => {
  it("should compute the current week range", () => {
    cy.visit("/");

    cy.window()
      .should("have.property", "getCurrentWeekRange")
      .then((value: unknown) => {
        const getCurrentWeekRange =
          asWindowFunction<GetCurrentWeekRange>(value);
        const {monday, saturday} = getCurrentWeekRange(new Date("2024-07-01"));

        const mondayDate = new Date(monday);
        const saturdayDate = new Date(saturday);

        expect(mondayDate).to.be.instanceOf(Date);
        expect(mondayDate.getDay()).to.eq(1); // Lundi

        expect(saturdayDate).to.be.instanceOf(Date);
        expect(saturdayDate.getDay()).to.eq(6);
      });
  });
});
