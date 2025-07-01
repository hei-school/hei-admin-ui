describe("getObjValue utility function", () => {
  it("should return correct values for various paths", () => {
    cy.visit("/");

    cy.window()
      .should("have.property", "getObjValue")
      .then((getObjValue: any) => {
        const obj = {a: {b: {c: 42}}, x: 0};

        expect(getObjValue(obj, "a.b.c")).to.eq(42);
        expect(getObjValue(obj, "a.b")).to.deep.eq({c: 42});
        expect(getObjValue(obj, "x")).to.eq(0);
        expect(getObjValue(obj, "not.exist")).to.eq(undefined);
        expect(getObjValue({}, "a.b")).to.eq(undefined);
        expect(getObjValue({a: null}, "a.b")).to.eq(undefined);
      });
  });
});

describe("exportData utility function", () => {
  it("should call exportData without error", () => {
    cy.visit("/");

    cy.window()
      .should("have.property", "exportData")
      .then((exportData: any) => {
        const headers = ["id", "name", "status"];
        const data = [
          {id: 1, name: "Alice", status: "active"},
          {id: 2, name: "Bob", status: "inactive"},
        ];
        expect(() => exportData(data, headers, "test_export")).not.to.throw();
      });
  });
});

describe("commentRenderer utility function", () => {
  it("should render comments correctly", () => {
    cy.visit("/");

    cy.window()
      .should("have.property", "commentRenderer")
      .then((commentRenderer: any) => {
        expect(commentRenderer("Note", 9, 0)).to.eq("Note M1");
        expect(commentRenderer("Note", 9, 2)).to.eq("Note M3");
        expect(commentRenderer("Note", 12, 0)).to.eq("Note");
        expect(commentRenderer("", 9, 0)).to.eq(null);
        expect(commentRenderer("", 12, 0)).to.eq(null);
      });
  });
});
