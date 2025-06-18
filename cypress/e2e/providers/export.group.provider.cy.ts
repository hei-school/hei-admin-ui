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

    it("delete() should throw not implemented error", () => {
      expect(() => exportGroupProvider.delete("")).to.throw("Not implemented");
    });
  });
});
