describe("Grades Data Utils coverage", () => {
  it("should cover validateGradeData and transformGradesData", () => {
    cy.visit("/");

    cy.window().then((win: any) => {
      expect(win).to.have.property("validateGradeData");
      expect(win).to.have.property("transformGradesData");

      const data = [
        {"grade.score": 15, "id": "student1", "name": "Alice"},
        {"grade.score": null, "id": "student2", "name": "Bob"},
      ];

      const transformed = win.transformGradesData(data);
      expect(transformed).to.have.length(1);
      expect(transformed[0][1]).to.have.length(2);

      expect(transformed[0][1][0].grade.score).to.eq(15);
      expect(transformed[0][1][0].id).to.eq("student1");
      expect(transformed[0][1][0].name).to.eq("Alice");

      expect(transformed[0][1][1].grade.score).to.eq(0);
      expect(transformed[0][1][1].id).to.eq("student2");

      const valid = win.validateGradeData(data);
      expect(valid).to.exist;
    });
  });
});
