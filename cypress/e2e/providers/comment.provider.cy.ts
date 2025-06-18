import {commentApi} from "@/providers/api";
import commentProvider from "@/providers/commentProvider";
import {commentMocks} from "../../fixtures/api_mocks/comment-mocks";
import {student1Mock} from "../../fixtures/api_mocks/students-mocks";

describe("Comment Provider", () => {
  const studentId = student1Mock.id;

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

  describe("getList()", () => {
    context("when getting comments for a specific student", () => {
      it("should get comments correctly", () => {
        const page = 1;
        const perPage = 10;
        const filter = {studentId};
        cy.intercept(
          "GET",
          `/students/${studentId}/comments?page=${page}&page_size=${perPage}`,
          commentMocks
        ).as("getStudentComments");
        commentProvider.getList(page, perPage, filter).then((result) => {
          cy.wait("@getStudentComments");
          expect(result.data).to.have.length(commentMocks.length);
          result.data.forEach((comment, index) => {
            expect(comment).to.deep.equal(commentMocks[index]);
          });
        });
      });
    });

    context("when getting comments without a specific student ID", () => {
      it("should get all comments correctly", () => {
        const page = 1;
        const perPage = 10;
        const filter = {};

        cy.intercept("GET", `/comments?page=${page}&page_size=${perPage}`, {
          data: commentMocks,
        }).as("getComments");

        commentProvider.getList(page, perPage, filter).then((result) => {
          cy.wait("@getComments");
          expect(result.data).to.have.length(commentMocks.length);
          result.data.forEach((comment, index) => {
            expect(comment).to.deep.equal(commentMocks[index]);
          });
        });
      });
    });
  });

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
