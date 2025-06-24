import {usersApi} from "@/providers/api";
import exportTeacherProvider from "@/providers/exportTeacherProvider";

describe("Export Teacher Provider", () => {
  const mockTeacherId = "teacher-123";
  const mockArrayBuffer = new ArrayBuffer(8);
  const mockResponse = {data: mockArrayBuffer};

  beforeEach(() => {
    cy.stub(usersApi(), "generateTeachersInXlsx").resolves(mockResponse);
  });

  describe("getOne()", () => {
    it("should call generateTeachersInXlsx with correct parameters", () => {
      exportTeacherProvider.getOne(mockTeacherId).then(() => {
        expect(usersApi().generateTeachersInXlsx).to.have.been.calledWith({
          responseType: "arraybuffer",
        });
      });
    });

    it("should return correct response structure", () => {
      exportTeacherProvider.getOne(mockTeacherId).then((result) => {
        expect(result).to.deep.equal({
          id: mockTeacherId,
          file: mockArrayBuffer,
        });
      });
    });

    it("should handle API errors", () => {
      const error = new Error("API failure");
      cy.stub(usersApi(), "generateTeachersInXlsx").rejects(error);
      exportTeacherProvider.getOne(mockTeacherId).catch((err) => {
        expect(err).to.equal(error);
      });
    });

    it("should handle different response sizes", () => {
      const testCases = [
        {size: 0, description: "empty"},
        {size: 1024, description: "small"},
        {size: 5 * 1024 * 1024, description: "large (5MB)"},
      ];

      testCases.forEach(({size, description}) => {
        it(`should handle ${description} ArrayBuffer`, () => {
          const buffer = new ArrayBuffer(size);
          cy.stub(usersApi(), "generateTeachersInXlsx").resolves({
            data: buffer,
          });
          exportTeacherProvider.getOne(mockTeacherId).then((result) => {
            expect(result.file.byteLength).to.equal(size);
          });
        });
      });
    });
  });

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

    it.skip("delete should throw error", () => {
      expect(() => exportTeacherProvider.delete("")).to.throw(
        "Not implemented"
      );
    });
  });

  describe("edge cases", () => {
    it("should handle undefined id", () => {
      exportTeacherProvider.getOne("").catch((err) => {
        expect(err.message).to.include("Cannot read properties");
      });
    });

    it("should handle empty string id", () => {
      exportTeacherProvider.getOne("").then((result) => {
        expect(result.id).to.equal("");
      });
    });
  });
});
