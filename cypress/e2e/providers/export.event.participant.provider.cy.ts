import exportEventParticipantProvider from "@/providers/exportEventParticipantProvider";

describe("Export Event Participant Provider", () => {
  describe("unimplemented methods", () => {
    it("getList() should throw not implemented error", () => {
      expect(() => exportEventParticipantProvider.getList(1, 10, {})).to.throw(
        "Not implemented"
      );
    });

    it("saveOrUpdate() should throw not implemented error", () => {
      expect(() => exportEventParticipantProvider.saveOrUpdate({})).to.throw(
        "Not implemented"
      );
    });

    it("delete() should throw not implemented error", () => {
      expect(() => exportEventParticipantProvider.delete("")).to.throw(
        "Not implemented"
      );
    });
  });
});
