import {usersApi} from "@/providers/api";
import exportStudentProvider from "@/providers/exportStudentProvider.ts";

describe("Export Student Provider", () => {
  const mockStudentId = "student-123";

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

  describe("edge cases", () => {
    it("should handle undefined id", () => {
      exportStudentProvider.getOne("", {}).catch((err) => {
        expect(err.message).to.include("Cannot read properties");
      });
    });

    it("should handle large file responses", () => {
      const largeBuffer = new ArrayBuffer(1024 * 1024 * 5);
      cy.stub(usersApi(), "generateStudentsInXlsx").resolves({
        data: largeBuffer,
      });
      exportStudentProvider.getOne(mockStudentId, {}).then((result) => {
        expect(result.file.byteLength).to.equal(1024 * 1024 * 5);
      });
    });

    it("should handle empty file responses", () => {
      const emptyBuffer = new ArrayBuffer(0);
      cy.stub(usersApi(), "generateStudentsInXlsx").resolves({
        data: emptyBuffer,
      });
      exportStudentProvider.getOne(mockStudentId, {}).then((result) => {
        expect(result.file.byteLength).to.equal(0);
      });
    });
  });
});
