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
