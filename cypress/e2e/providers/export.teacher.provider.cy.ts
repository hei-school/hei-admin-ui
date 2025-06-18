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

    it("delete should throw error", () => {
      expect(() => exportTeacherProvider.delete("")).to.throw(
        "Not implemented"
      );
    });
  });
});
