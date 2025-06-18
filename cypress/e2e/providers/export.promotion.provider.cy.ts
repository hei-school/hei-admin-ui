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

    context("with different response scenarios", () => {
      it("should handle empty ArrayBuffer", () => {
        const emptyBuffer = new ArrayBuffer(0);
        cy.stub(promotionApi(), "getStudentsByPromotion").resolves({
          data: emptyBuffer,
        });
        exportPromotionProvider.getOne(mockPromotionId).then((result) => {
          expect(result.file.byteLength).to.equal(0);
        });
      });

      it("should handle large ArrayBuffer (5MB)", () => {
        const largeBuffer = new ArrayBuffer(5 * 1024 * 1024);
        cy.stub(promotionApi(), "getStudentsByPromotion").resolves({
          data: largeBuffer,
        });
        exportPromotionProvider.getOne(mockPromotionId).then((result) => {
          expect(result.file.byteLength).to.equal(5 * 1024 * 1024);
        });
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

  describe("special cases", () => {
    it("should maintain response structure", () => {
      exportPromotionProvider.getOne(mockPromotionId).then((result) => {
        expect(result).to.have.all.keys(["id", "file"]);
        expect(result.file).to.be.instanceOf(ArrayBuffer);
      });
    });

    it("should handle different promotion ID formats", () => {
      const uuidPromotionId = "123e4567-e89b-12d3-a456-426614174000";
      exportPromotionProvider.getOne(uuidPromotionId).then((result) => {
        expect(result.id).to.equal(uuidPromotionId);
      });
    });
  });
});
