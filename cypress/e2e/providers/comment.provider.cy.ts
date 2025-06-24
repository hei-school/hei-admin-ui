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

  describe("saveOrUpdate()", () => {
    context("when creating a new comment", () => {
      it("should create the comment successfully", () => {
        const newComment = {
          student_id: studentId,
          observer_id: "observer-1",
          content: "New test comment",
          creation_datetime: new Date().toISOString(),
        };

        cy.intercept(
          "POST",
          `/students/${studentId}/observers/${newComment.observer_id}/comments`,
          {
            statusCode: 201,
            body: {...newComment, id: "new-comment-id"},
          }
        ).as("createComment");

        commentProvider.saveOrUpdate([newComment]).then((result) => {
          cy.wait("@createComment");
          expect(result).to.have.length(1);
          expect(result[0].id).to.equal("new-comment-id");
          expect(result[0].student_id).to.equal(studentId);
          expect(result[0].content).to.equal(newComment.content);
        });
      });
    });

    context("with invalid payload", () => {
      it("should throw an error when payload is empty", () => {
        commentProvider.saveOrUpdate([]).catch((error) => {
          expect(error.message).to.include("Cannot read properties");
        });
      });
    });
  });

  describe("unimplemented methods", () => {
    it("should throw error for getOne", () => {
      expect(() => commentProvider.getOne("")).to.throw("Not implemented");
    });

    it.skip("should throw error for delete", () => {
      expect(() => commentProvider.delete("")).to.throw("Not implemented");
    });
  });
});
