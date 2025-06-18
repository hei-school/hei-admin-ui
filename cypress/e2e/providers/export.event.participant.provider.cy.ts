import {eventsApi} from "@/providers/api";
import exportEventParticipantProvider from "@/providers/exportEventParticipantProvider";

describe("Export Event Participant Provider", () => {
  const mockEventId = "event-123";
  const mockArrayBuffer = new ArrayBuffer(8);
  const mockResponse = {data: mockArrayBuffer};

  beforeEach(() => {
    cy.stub(eventsApi(), "generateEventStudentsParticipantInXlsx").resolves(
      mockResponse
    );
  });

  describe("getOne()", () => {
    it("should generate and return an XLSX file for event participants", () => {
      exportEventParticipantProvider.getOne(mockEventId).then((result) => {
        expect(
          eventsApi().generateEventStudentsParticipantInXlsx
        ).to.have.been.calledWith(mockEventId, {responseType: "arraybuffer"});
        expect(result.id).to.equal(mockEventId);
        expect(result.file).to.equal(mockArrayBuffer);
      });
    });

    it("should handle API errors gracefully", () => {
      const error = new Error("API Error");
      cy.stub(eventsApi(), "generateEventStudentsParticipantInXlsx").rejects(
        error
      );
      exportEventParticipantProvider.getOne(mockEventId).catch((err) => {
        expect(err).to.equal(error);
      });
    });
  });

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
