import feesExportProvider from "@/providers/feesExportProvider";

describe("Fees Export Provider", () => {
  describe("unimplemented method", () => {
    it("getlist() should throw an error", () => {
      expect(() => feesExportProvider.getList(1, 10, {})).to.throw(
        "Not implemented"
      );
    });

    it("saveOrUpdate() should throw an error", () => {
      expect(() => feesExportProvider.saveOrUpdate([])).to.throw(
        "Not implemented"
      );
    });

    it("delete() should throw an error", () => {
      expect(() => feesExportProvider.delete("123")).to.throw(
        "Not implemented"
      );
    });
  });
});
