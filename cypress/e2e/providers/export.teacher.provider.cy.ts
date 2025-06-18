import exportTeacherProvider from "@/providers/exportTeacherProvider";

describe("Export Teacher Provider", () => {
  describe("unimplemented methods", () => {
    it("getList should throw error", () => {
      expect(() => exportTeacherProvider.getList(1, 10, {})).to.throw(
        "Not implemented"
      );
    });

    it("saveOrUpdate should throw error", () => {
      expect(() => exportTeacherProvider.saveOrUpdate({})).to.throw(
        "Not implemented"
      );
    });

    it("delete should throw error", () => {
      expect(() => exportTeacherProvider.delete("")).to.throw(
        "Not implemented"
      );
    });
  });
});
