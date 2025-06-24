import {teachingApi} from "@/providers/api";
import exportGroupProvider from "@/providers/exportGroupProvider";

describe("Export Group Provider", () => {
  const mockGroupId = "group-123";
  const mockArrayBuffer = new ArrayBuffer(8);
  const mockResponse = {data: mockArrayBuffer};

  beforeEach(() => {
    cy.stub(teachingApi(), "generateStudentsGroupInXlsx").resolves(
      mockResponse
    );
  });

  describe("getOne()", () => {
    it("should generate and return an XLSX file for group students", () => {
      exportGroupProvider.getOne(mockGroupId).then((result) => {
        expect(
          teachingApi().generateStudentsGroupInXlsx
        ).to.have.been.calledWith(mockGroupId, {responseType: "arraybuffer"});
        expect(result.id).to.equal(mockGroupId);
        expect(result.file).to.equal(mockArrayBuffer);
      });
    });

    it("should handle API errors", () => {
      const error = new Error("API Error");
      cy.stub(teachingApi(), "generateStudentsGroupInXlsx").rejects(error);
      exportGroupProvider.getOne(mockGroupId).catch((err) => {
        expect(err).to.equal(error);
      });
    });

    context("with different response types", () => {
      it("should handle empty ArrayBuffer", () => {
        const emptyBuffer = new ArrayBuffer(0);
        cy.stub(teachingApi(), "generateStudentsGroupInXlsx").resolves({
          data: emptyBuffer,
        });
        exportGroupProvider.getOne(mockGroupId).then((result) => {
          expect(result.file.byteLength).to.equal(0);
        });
      });

      it("should handle large ArrayBuffer (5MB)", () => {
        const largeBuffer = new ArrayBuffer(5 * 1024 * 1024);
        cy.stub(teachingApi(), "generateStudentsGroupInXlsx").resolves({
          data: largeBuffer,
        });
        exportGroupProvider.getOne(mockGroupId).then((result) => {
          expect(result.file.byteLength).to.equal(5 * 1024 * 1024);
        });
      });
    });
  });

  describe("unimplemented methods", () => {
    it("getList() should throw not implemented error", () => {
      expect(() => exportGroupProvider.getList(1, 10, {})).to.throw(
        "Not implemented"
      );
    });

    it("saveOrUpdate() should throw not implemented error", () => {
      expect(() => exportGroupProvider.saveOrUpdate({})).to.throw(
        "Not implemented"
      );
    });

    it.skip("delete() should throw not implemented error", () => {
      expect(() => exportGroupProvider.delete("")).to.throw("Not implemented");
    });
  });

  describe("response validation", () => {
    it("should return object with correct structure", () => {
      exportGroupProvider.getOne(mockGroupId).then((result) => {
        expect(result).to.have.all.keys(["id", "file"]);
        expect(result.file).to.be.instanceOf(ArrayBuffer);
      });
    });

    it("should throw error when id is not provided", () => {
      exportGroupProvider.getOne("").catch((err) => {
        expect(err.message).to.include("Cannot read properties");
      });
    });
  });
});
