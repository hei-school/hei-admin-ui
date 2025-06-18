import profilePicProvider from "@/providers/profilePicProvider";

describe("Profile Pic Provider", () => {
  describe("unimplemented methods", () => {
    it("getList() should throw not implemented error", () => {
      expect(() => profilePicProvider.getList(1, 10, {})).to.throw(
        "Not implemented"
      );
    });

    it("getOne() should throw not implemented error", () => {
      expect(() => profilePicProvider.getOne("")).to.throw("Not implemented");
    });

    it("delete() should throw not implemented error", () => {
      expect(() => profilePicProvider.delete("")).to.throw("Not implemented");
    });
  });
});
