import {
  commentMocks,
  student1CommentMocks,
} from "../fixtures/api_mocks/comment-mocks";
import {student1Mock} from "../fixtures/api_mocks/students-mocks";

const ITEM_PER_LIST = 10;

describe("Student.Comments", () => {
  beforeEach(() => {
    cy.login({role: "STUDENT"});
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/comments?page=2&page_size=10`,
      student1CommentMocks.slice(ITEM_PER_LIST)
    ).as("getStudent1CommentsPage2");
  });

  it("student can list his comments", () => {
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/comments?page=1&page_size=10`,
      student1CommentMocks.slice(0, ITEM_PER_LIST)
    ).as("getStudent1CommentsPage1");
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

  it("student view empty list of comments", () => {
    cy.intercept(
      "GET",
      `/students/${student1Mock.id}/comments?page=1&page_size=10`,
      []
    ).as("getEmptyComments");
    cy.get('[aria-label="Commentaires"]').click();
    cy.wait("@getEmptyComments");
    cy.get('[data-testid="comment-list-wrapper"]').contains(
      "Pas encore de commentaires"
    );
    cy.getByTestid("comment-item").should("have.length", 0);
  });
});

describe("Global.Comments", () => {
  beforeEach(() => {
    cy.intercept(
      "GET",
      `/comments?page=1&page_size=10`,
      commentMocks.slice(0, ITEM_PER_LIST)
    ).as("getStudent1CommentsPage1");
    cy.intercept(
      "GET",
      `/comments?page=2&page_size=10`,
      commentMocks.slice(ITEM_PER_LIST)
    ).as("getStudent1CommentsPage2");
  });

  it("manager can list global comments", () => {
    cy.login({role: "MANAGER"});
  });

  it("teacher can list global comments", () => {
    cy.login({role: "TEACHER"});
  });

  afterEach(() => {
    cy.getByTestid("appbar-comments").click();
    cy.getByTestid("comment-item").should("have.length", ITEM_PER_LIST);
    cy.getByTestid("comment-list-wrapper").scrollTo("bottom");
    cy.wait("@getStudent1CommentsPage2");
    cy.getByTestid("comment-item").should("have.length", commentMocks.length);
  });
});
