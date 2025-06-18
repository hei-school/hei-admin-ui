import exportStudentProvider from "@/providers/exportStudentProvider.ts";

describe("Export Student Provider", () => {
  describe("unimplemented methods", () => {
    it("getList() should throw error", () => {
      expect(() => exportStudentProvider.getList(1, 10, {})).to.throw(
        "Not implemented"
      );
    });

    it("saveOrUpdate() should throw error", () => {
      expect(() => exportStudentProvider.saveOrUpdate({})).to.throw(
        "Not implemented"
      );
    });

    it("delete() should throw error", () => {
      expect(() => exportStudentProvider.delete("")).to.throw(
        "Not implemented"
      );
    });
  });
});
