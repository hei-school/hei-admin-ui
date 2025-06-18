import {promotionApi} from "@/providers/api";
import exportPromotionProvider from "@/providers/exportPromotionProvider";

describe("Export Promotion Provider", () => {
  const mockPromotionId = "promotion-123";
  const mockArrayBuffer = new ArrayBuffer(8);
  const mockResponse = {data: mockArrayBuffer};

  beforeEach(() => {
    cy.stub(promotionApi(), "getStudentsByPromotion").resolves(mockResponse);
  });

  describe("getOne()", () => {
    it("should generate and return student list for a promotion", () => {
      exportPromotionProvider.getOne(mockPromotionId).then((result) => {
        expect(promotionApi().getStudentsByPromotion).to.have.been.calledWith(
          mockPromotionId,
          {responseType: "arraybuffer"}
        );
        expect(result.id).to.equal(mockPromotionId);
        expect(result.file).to.equal(mockArrayBuffer);
      });
    });

    it("should handle API errors gracefully", () => {
      const error = new Error("API Error");
      cy.stub(promotionApi(), "getStudentsByPromotion").rejects(error);
      exportPromotionProvider.getOne(mockPromotionId).catch((err) => {
        expect(err).to.equal(error);
      });
    });
  });

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
