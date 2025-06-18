import {usersApi} from "@/providers/api";
import exportStudentProvider from "@/providers/exportStudentProvider";

describe("Export Student Provider", () => {
  const mockStudentId = "student-123";
  const mockArrayBuffer = new ArrayBuffer(8);
  const mockResponse = {data: mockArrayBuffer};

  beforeEach(() => {
    cy.stub(usersApi(), "generateStudentsInXlsx").resolves(mockResponse);
  });

  describe("getOne()", () => {
    const testCases = [
      {
        description: "with all filters",
        meta: {
          status: "active",
          sex: "M",
          workStudyStatus: "working",
        },
        expectedCall: [
          "undefined",
          "active",
          "M",
          "working",
          "undefined",
          {responseType: "arraybuffer"},
        ],
      },
      {
        description: "with only status filter",
        meta: {status: "inactive"},
        expectedCall: [
          "undefined",
          "inactive",
          "undefined",
          "undefined",
          "undefined",
          {responseType: "arraybuffer"},
        ],
      },
      {
        description: "with empty meta",
        meta: {},
        expectedCall: [
          "undefined",
          "undefined",
          "undefined",
          "undefined",
          "undefined",
          {responseType: "arraybuffer"},
        ],
      },
    ];

    testCases.forEach(({description, meta, expectedCall}) => {
      it(`should call API correctly ${description}`, () => {
        exportStudentProvider.getOne(mockStudentId, meta).then(() => {
          expect(usersApi().generateStudentsInXlsx).to.have.been.calledWith(
            ...expectedCall
          );
        });
      });
    });

    it("should return correct response structure", () => {
      exportStudentProvider.getOne(mockStudentId, {}).then((result) => {
        expect(result).to.deep.equal({
          id: mockStudentId,
          file: mockArrayBuffer,
        });
      });
    });

    it("should handle API errors", () => {
      const error = new Error("API failure");
      cy.stub(usersApi(), "generateStudentsInXlsx").rejects(error);
      exportStudentProvider.getOne(mockStudentId, {}).catch((err) => {
        expect(err).to.equal(error);
      });
    });
  });

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
