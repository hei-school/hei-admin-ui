import {commentApi} from "@/providers/api";
import commentProvider from "@/providers/commentProvider";

describe("Comment Provider", () => {
  beforeEach(() => {
    cy.stub(commentApi(), "getStudentComments").resolves({
      data: [{id: "1", student_id: "123", content: "Test comment"}],
    });
    cy.stub(commentApi(), "getComments").resolves({
      data: [{id: "1", content: "General comment"}],
    });
    cy.stub(commentApi(), "postComment").resolves({
      data: {
        id: "new1",
        student_id: "123",
        observer_id: "456",
        content: "New comment",
      },
    });
  });

  describe("getList()", () => {});

  describe("saveOrUpdate()", () => {});

  describe("unimplemented methods", () => {
    it("should throw error for getOne", () => {
      expect(() => commentProvider.getOne("")).to.throw("Not implemented");
    });

    it("should throw error for delete", () => {
      expect(() => commentProvider.delete("")).to.throw("Not implemented");
    });
  });
});
