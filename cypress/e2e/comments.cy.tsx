import {student1CommentMocks} from "../fixtures/api_mocks/comment-mocks";
import {student1Mock} from "../fixtures/api_mocks/students-mocks";

const ITEM_PER_LIST = 10;

describe("Student.Comments", () => {
  beforeEach(() => {
    cy.login({role: "STUDENT"});
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/comments?page=1&page_size=10`,
      student1CommentMocks.slice(0, ITEM_PER_LIST)
    ).as("getStudent1CommentsPage1");
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/comments?page=2&page_size=10`,
      student1CommentMocks.slice(ITEM_PER_LIST)
    ).as("getStudent1CommentsPage2");
  });

  it.only("student can list his comments", () => {
    cy.get('[aria-label="Commentaires"]').click();
    cy.wait("@getStudent1CommentsPage1");
    cy.getByTestid("comment-item").should("have.length", ITEM_PER_LIST);
    cy.getByTestid("comment-list-wrapper").scrollTo("bottom");
    cy.wait("@getStudent1CommentsPage2");
    cy.getByTestid("comment-item").should(
      "have.length",
      student1CommentMocks.length
    );
  });
});
