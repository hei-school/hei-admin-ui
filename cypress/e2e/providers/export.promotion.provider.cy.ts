import exportPromotionProvider from "@/providers/exportPromotionProvider";

describe("Export Promotion Provider", () => {
  describe("unimplemented methods", () => {
    it("getList() should throw not implemented error", () => {
      expect(() => exportPromotionProvider.getList(1, 10, {})).to.throw(
        "Not implemented"
      );
    });

    it("saveOrUpdate() should throw not implemented error", () => {
      expect(() => exportPromotionProvider.saveOrUpdate({})).to.throw(
        "Not implemented"
      );
    });

    it("delete() should throw not implemented error", () => {
      expect(() => exportPromotionProvider.delete("")).to.throw(
        "Not implemented"
      );
    });
  });
});
