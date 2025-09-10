describe("Grades Data Utils coverage", () => {
  it("should cover validateGradeData and transformGradesData", () => {
    cy.visit("/");

    cy.window().then((win: any) => {
      expect(win).to.have.property("validateGradeData");
      expect(win).to.have.property("transformGradesData");

      const validData = [
        {student_ref: "STD001", score: 15, comment: "Excellent work"},
        {student_ref: "STD002", score: 12.5, comment: "Good effort"},
        {student_ref: "STD003", score: "", comment: ""},
      ];

      const invalidData = [
        {student_ref: "STD004", score: 25, comment: "Out of range"},
        {student_ref: "STD005", score: -5, comment: "Negative score"},
        {student_ref: "STD006", score: "abc", comment: "Not a number"},
        {student_ref: "STD007", score: 15, comment: ""},
      ];

      const transformed = win.transformGradesData(validData);
      expect(transformed).to.have.length(2);
      expect(transformed[0]).to.deep.equal([]);
      expect(transformed[1]).to.have.length(3);

      expect(transformed[1][0]).to.deep.equal({
        student_ref: "STD001",
        grade: {
          score: 15,
          student_id: null,
        },
        comment: "Excellent work",
      });

      expect(transformed[1][1]).to.deep.equal({
        student_ref: "STD002",
        grade: {
          score: 12.5,
          student_id: null,
        },
        comment: "Good effort",
      });

      expect(transformed[1][2]).to.deep.equal({
        student_ref: "STD003",
        comment: "",
      });

      const validationResult = win.validateGradeData(validData);
      expect(validationResult).to.have.property("isValid", true);
      expect(validationResult).to.have.property("errors");
      expect(validationResult.errors).to.be.empty;

      const invalidValidationResult = win.validateGradeData(invalidData);
      expect(invalidValidationResult).to.have.property("isValid", false);
      expect(invalidValidationResult).to.have.property("errors");
      expect(invalidValidationResult.errors).to.not.be.empty;

      const emptyData: Array<{
        student_ref: string;
        score: number | string;
        comment: string;
      }> = [];
      const emptyTransformed = win.transformGradesData(emptyData);
      expect(emptyTransformed).to.deep.equal([[], []]);

      const nullData = null;
      const nullTransformed = win.transformGradesData(nullData);
      expect(nullTransformed).to.deep.equal([[], []]);
    });
  });
});

describe("getCurrentWeekRange coverage", () => {
  it("should compute the current week range", () => {
    cy.visit("/");

    cy.window()
      .should("have.property", "getCurrentWeekRange")
      .then((getCurrentWeekRange: any) => {
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
