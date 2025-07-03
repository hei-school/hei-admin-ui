describe("validateData and transformUserData utility functions", () => {
  it("should validate and transform user data", () => {
    cy.visit("/");

    cy.window().then((win: any) => {
      expect(win).to.have.property("validateData");
      expect(win).to.have.property("transformUserData");

      const minimalUser = {
        ref: "r1",
        first_name: "Alice",
        last_name: "Smith",
        email: "alice@hei.school",
        entrance_datetime: 43831,
      };

      // Cas valide
      let result = win.validateData([minimalUser], win.minimalImportHeaders);
      expect(result).to.have.property("isValid", true);

      // Cas vide
      result = win.validateData([], win.minimalImportHeaders);
      expect(result.isValid).to.eq(false);
      expect(result.message).to.eq("Il n'y a pas d'élément à insérer");

      // Cas en-têtes incorrects
      const invalidUser = {foo: "bar"};
      result = win.validateData([invalidUser], win.minimalImportHeaders);
      expect(result.isValid).to.eq(false);
      expect(result.message).to.eq(
        "Veuillez re-vérifier les en-têtes de votre fichier"
      );

      // Cas trop d'éléments
      const users = Array(21).fill(minimalUser);
      result = win.validateData(users, win.minimalImportHeaders);
      expect(result.isValid).to.eq(false);
      expect(result.message).to.eq(
        "Vous ne pouvez importer que 20 éléments à la fois."
      );

      // Transformation test
      const data = [
        {
          ...minimalUser,
          birth_date: 43831,
          payment_frequency: "mensuel",
          student_refs: "A,B",
        },
      ];
      const transformed = win.transformUserData(data);
      expect(transformed[0]).to.have.property("status");
      expect(transformed[0]).to.have.property("specialization_field");
      expect(transformed[0]).to.have.property("coordinates");
      expect(transformed[0].payment_frequency).to.eq("MONTHLY");
      expect(transformed[0].student_refs).to.deep.eq(["A", "B"]);
    });
  });
});

describe("commentRenderer utility function", () => {
  it("should render comments correctly", () => {
    cy.visit("/");

    cy.window().then((win: any) => {
      expect(win).to.have.property("commentRenderer");

      const fn = win.commentRenderer;

      expect(fn("Note", 9, 0)).to.eq("Note M1");
      expect(fn("Note", 9, 2)).to.eq("Note M3");
      expect(fn("Note", 12, 0)).to.eq("Note");
      expect(fn("", 9, 0)).to.eq(null);
      expect(fn("", 12, 0)).to.eq(null);
    });
  });
});

describe("StatusRadioButton component", () => {
  it("should expose StatusRadioButton on window", () => {
    cy.visit("/");

    cy.window().then((win: any) => {
      expect(win).to.have.property("StatusRadioButton");
    });
  });
});
