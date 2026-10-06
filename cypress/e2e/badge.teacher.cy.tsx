import {
  badgeLinkOf,
  badgePublicId,
  finishedCourseMock,
  scannedParticipantMock,
  suspendedScannedParticipantMock,
  teacherCourseInProgressMock,
  teacherOtherCourseInProgressMock,
  unknownBadgePublicId,
  validBadgeMock,
} from "../fixtures/api_mocks/badges-mocks";
import {
  event1mock,
  eventParticipantsMock,
} from "../fixtures/api_mocks/event-mocks";

const attendanceUrl = (publicId: string, eventId: string) =>
  `**/students/badges/${publicId}/events/${eventId}/attendance`;
const teacherEventsUrl = "/events?page=1&page_size=100*";

const scanLink = (link: string) => {
  cy.contains("label", "Ou lien du badge")
    .parent()
    .find("input")
    .clear()
    .type(link);
  cy.contains("button", "Valider").click();
};

describe("Teacher checks the attendance of his course by badge", () => {
  beforeEach(() => {
    cy.mockLogin({role: "TEACHER"});
  });

  const openAttendancePage = () => {
    cy.getByTestid("badge-attendance-menu").click();
    cy.routePathnameEq("/badges/attendance");
    cy.wait("@getTeacherEvents");
  };

  describe("during a course", () => {
    beforeEach(() => {
      cy.intercept("GET", teacherEventsUrl, [
        teacherCourseInProgressMock,
        finishedCourseMock,
      ]).as("getTeacherEvents");
      openAttendancePage();
    });

    it("captures the course in progress", () => {
      cy.contains(teacherCourseInProgressMock.title!);
      cy.contains(teacherCourseInProgressMock.course!.code!);
      cy.contains("G1");
    });

    it("marks the scanned student present", () => {
      cy.intercept(
        "PUT",
        attendanceUrl(badgePublicId, teacherCourseInProgressMock.id!),
        scannedParticipantMock
      ).as("checkAttendance");

      scanLink(badgeLinkOf(badgePublicId));

      cy.wait("@checkAttendance");
      cy.contains(
        `${scannedParticipantMock.last_name} ${scannedParticipantMock.first_name}`
      );
      cy.contains(`${scannedParticipantMock.ref} · présent(e)`);
      cy.getByTestid("scan-result-warning").should("not.exist");
    });

    it("warns that the scanned student is suspended for overdue fees", () => {
      cy.intercept(
        "PUT",
        attendanceUrl(badgePublicId, teacherCourseInProgressMock.id!),
        suspendedScannedParticipantMock
      ).as("checkAttendance");

      scanLink(badgeLinkOf(badgePublicId));

      cy.wait("@checkAttendance");
      cy.contains(`${scannedParticipantMock.ref} · présent(e)`);
      cy.getByTestid("scan-result-warning").should(
        "contain",
        "Suspendu : frais en retard, passage au bureau requis."
      );
    });

    it("refuses a badge that is no longer valid", () => {
      cy.intercept(
        "PUT",
        attendanceUrl(badgePublicId, teacherCourseInProgressMock.id!),
        {statusCode: 400}
      );

      scanLink(badgePublicId);

      cy.contains("Badge non valable");
    });

    it("tells that the student does not follow the course", () => {
      cy.intercept(
        "PUT",
        attendanceUrl(badgePublicId, teacherCourseInProgressMock.id!),
        {statusCode: 404}
      );
      cy.intercept(
        "GET",
        `**/students/badges/${badgePublicId}`,
        validBadgeMock
      );

      scanLink(badgePublicId);

      cy.contains(`${validBadgeMock.last_name} ${validBadgeMock.first_name}`);
      cy.contains("N'est pas inscrit(e) à ce cours.");
    });

    it("tells that an unknown badge does not exist", () => {
      cy.intercept(
        "PUT",
        attendanceUrl(unknownBadgePublicId, teacherCourseInProgressMock.id!),
        {statusCode: 404}
      );
      cy.intercept("GET", `**/students/badges/${unknownBadgePublicId}`, {
        statusCode: 404,
      });

      scanLink(unknownBadgePublicId);

      cy.contains("Badge inconnu");
    });

    it("tells when the attendance cannot be checked", () => {
      cy.intercept(
        "PUT",
        attendanceUrl(badgePublicId, teacherCourseInProgressMock.id!),
        {statusCode: 403}
      );
      cy.intercept(
        "PUT",
        attendanceUrl(unknownBadgePublicId, teacherCourseInProgressMock.id!),
        {statusCode: 500}
      );

      scanLink(badgePublicId);
      cy.contains("Accès refusé");
      scanLink(unknownBadgePublicId);
      cy.contains("Réessayez de scanner le badge.");
    });

    it("refuses a link that is not a badge", () => {
      scanLink("not a badge");

      cy.contains("Lien de badge invalide.");
    });
  });

  it("lets choose between two courses in progress", () => {
    cy.intercept("GET", teacherEventsUrl, [
      teacherCourseInProgressMock,
      teacherOtherCourseInProgressMock,
    ]).as("getTeacherEvents");
    cy.intercept(
      "PUT",
      attendanceUrl(badgePublicId, teacherOtherCourseInProgressMock.id!),
      scannedParticipantMock
    ).as("checkOtherAttendance");
    openAttendancePage();

    cy.contains("label", "Cours en cours").parent().click();
    cy.get("[role='option']").should("have.length", 2).last().click();
    scanLink(badgePublicId);

    cy.wait("@checkOtherAttendance");
    cy.contains("présent(e)");
  });

  it("tells when there is no course in progress, then refreshes", () => {
    cy.intercept("GET", teacherEventsUrl, [finishedCourseMock]).as(
      "getTeacherEvents"
    );
    openAttendancePage();

    cy.contains("Vous n'avez pas de cours en ce moment dans le calendrier.");
    cy.contains("Ou lien du badge").should("not.exist");

    cy.intercept("GET", teacherEventsUrl, [teacherCourseInProgressMock]).as(
      "getTeacherEvents"
    );
    cy.contains("Actualiser mes cours").click();
    cy.wait("@getTeacherEvents");
    cy.contains(teacherCourseInProgressMock.title!);
    cy.contains("Ou lien du badge");
  });

  it("tells when the calendar cannot be loaded", () => {
    cy.intercept("GET", teacherEventsUrl, {statusCode: 500}).as(
      "getTeacherEvents"
    );
    openAttendancePage();

    cy.contains("Impossible de charger votre calendrier, réessayez.");
  });
});

describe("Teacher scans the badges of an event", () => {
  beforeEach(() => {
    cy.intercept("GET", `/events/${event1mock.id}`, event1mock);
    cy.intercept(
      "GET",
      `/events/${event1mock.id}/participants?*`,
      eventParticipantsMock
    ).as("getEventParticipants");
    cy.mockLogin({role: "TEACHER"});
    cy.visit(`/events/${event1mock.id}/participants`);
    cy.wait("@getEventParticipants");
    cy.getByTestid("menu-list-action").click();
    cy.get(".MuiPopover-paper").contains("Scanner les badges").click();
  });

  it("marks the scanned students present", () => {
    cy.intercept(
      "PUT",
      attendanceUrl(badgePublicId, event1mock.id!),
      scannedParticipantMock
    ).as("checkAttendance");
    cy.contains("Présentez les badges un par un devant la caméra");

    scanLink(badgeLinkOf(badgePublicId));

    cy.wait("@checkAttendance");
    cy.wait("@getEventParticipants");
    cy.contains(`${scannedParticipantMock.ref} · présent(e)`);
    cy.get("[aria-label='Fermer']").click();
    cy.contains("Présentez les badges un par un").should("not.exist");
  });

  it("warns that the scanned student is suspended for overdue fees", () => {
    cy.intercept(
      "PUT",
      attendanceUrl(badgePublicId, event1mock.id!),
      suspendedScannedParticipantMock
    ).as("checkAttendance");

    scanLink(badgeLinkOf(badgePublicId));

    cy.wait("@checkAttendance");
    cy.contains(`${scannedParticipantMock.ref} · présent(e)`);
    cy.getByTestid("scan-result-warning").should(
      "contain",
      "Suspendu : frais en retard, passage au bureau requis."
    );
  });

  it("tells that the student does not take part in the event", () => {
    cy.intercept("PUT", attendanceUrl(badgePublicId, event1mock.id!), {
      statusCode: 404,
    });
    cy.intercept("GET", `**/students/badges/${badgePublicId}`, validBadgeMock);

    scanLink(badgePublicId);

    cy.contains("Ne participe pas à cet événement.");
  });
});
