import {formatDate, getTime} from "@/utils/date";
import {
  Student,
  StudentGlobalAttendance,
} from "@haapi-b0fc7615/typescript-client";
import {
  absenceLettersMock,
  blockUnmockedApi,
  navigateInApp,
  participationStudentId,
  pendingLetterMock,
  receivedLetterMock,
  rejectedLetterMock,
  studentAttendanceMock,
} from "../fixtures/api_mocks/coverage-absences-mocks";
import {student1Mock} from "../fixtures/api_mocks/students-mocks";

type Query = Record<string, string | number>;

const ENTRANCE_DATE = "2021-11-08";
const TODAY = new Date().toISOString().split("T")[0];
const [algoAttendance, examAttendance, , , integrationAttendance] =
  studentAttendanceMock;

const mockAttendance = (
  requests: Query[],
  reply: (query: Query) => StudentGlobalAttendance[] = () =>
    studentAttendanceMock
) => {
  cy.intercept(
    {method: "GET", pathname: `/students/${participationStudentId}/attendance`},
    (req) => {
      requests.push(req.query);
      req.reply(reply(req.query));
    }
  ).as("getAttendance");
};

const mockLetters = (requests: Query[]) => {
  cy.intercept(
    {method: "GET", pathname: `/users/${participationStudentId}/letters`},
    (req) => {
      requests.push(req.query);
      req.reply(
        req.query.event_id === algoAttendance.id ? absenceLettersMock : []
      );
    }
  ).as("getLetters");
};

const mockStudentLevel = () => {
  cy.intercept(
    {method: "GET", pathname: `/students/${participationStudentId}/level`},
    {body: "L1"}
  );
};

const visitManagerParticipation = () => {
  navigateInApp(`/students/${participationStudentId}/show?tab=participation`);
  cy.contains("Participation aux événements").should("be.visible");
};

const fieldOf = (label: string) => cy.contains("label", label).parent();

const selectOption = (label: string, value: string) => {
  fieldOf(label).find(".MuiSelect-select").click();
  cy.get(`li[data-value="${value}"]`).should("be.visible").click();
};

const cardOf = (title: string) => cy.contains(".MuiCard-root", title);

const absenceDialog = () =>
  cy.contains('[role="dialog"]', "Détails de l'absence");

const closeDialogTitled = (title: string) => {
  cy.contains("h6", title)
    .parents(".MuiDialogTitle-root")
    .find("button")
    .click();
  cy.contains("h6", title).should("not.exist");
};

const confirmDialog = (title: string) =>
  cy.contains(".MuiDialog-root", title).find('[role="dialog"]');

describe("Participation d'un étudiant vue par un manager", () => {
  let attendanceRequests: Query[];

  beforeEach(() => {
    attendanceRequests = [];
    blockUnmockedApi();
    cy.mockLogin({role: "MANAGER"});
    cy.intercept(
      {method: "GET", pathname: `/students/${participationStudentId}`},
      student1Mock
    ).as("getStudent");
    mockStudentLevel();
    mockLetters([]);
  });

  it("affiche les participations depuis la date d'entrée de l'étudiant", () => {
    mockAttendance(attendanceRequests);
    visitManagerParticipation();

    cy.wait("@getAttendance")
      .its("request.query")
      .should((query: Query) => {
        expect(query.from).to.eq(`${ENTRANCE_DATE}T00:00:00Z`);
        expect(query.to).to.eq(`${TODAY}T23:59:59Z`);
        expect(query.attendanceStatus).to.eq("MISSING");
      });
    cy.contains("Participation aux événements (5)").should("be.visible");
    fieldOf("Date de début").find("input").should("have.value", ENTRANCE_DATE);
    cy.contains(".MuiChip-root", "2 actif(s)").should("be.visible");
    cy.contains("button", "Réinitialiser").should("be.visible");
    cy.contains("button", "Appliquer les filtres").should("be.disabled");

    cardOf(algoAttendance.title!)
      .should("contain", "Absent")
      .and("contain", formatDate(algoAttendance.begin_datetime, false))
      .and(
        "contain",
        `${getTime(algoAttendance.begin_datetime)} - ${getTime(algoAttendance.end_datetime)}`
      )
      .and("contain", "SIGMA")
      .and("contain", algoAttendance.description);
    cardOf(examAttendance.title!)
      .should("contain", "En retard")
      .and("contain", `Début: ${formatDate(examAttendance.begin_datetime)}`)
      .and("contain", `Fin: ${formatDate(examAttendance.end_datetime)}`)
      .and("contain", "ANDRAHARO");
    cardOf("Seminaire IA").should("contain", "Présent");
    cardOf("Base de donnees").should("contain", "Non vérifié");
    cardOf(integrationAttendance.title!).should("contain", "Non vérifié");
  });

  it("filtre par type d'événement puis réinitialise les filtres", () => {
    mockAttendance(attendanceRequests);
    visitManagerParticipation();
    cy.contains("Participation aux événements (5)").should("be.visible");

    selectOption("Type d'événement", "COURSE");
    cy.contains("button", "Appliquer les filtres").should("be.enabled").click();

    cy.contains("Participation aux événements (2)").should("be.visible");
    cardOf("Seminaire IA").should("not.exist");
    cy.contains(".MuiChip-root", "3 actif(s)").should("be.visible");

    cy.contains("button", "Réinitialiser").click();

    cy.contains("Participation aux événements (5)").should("be.visible");
    cy.contains("button", "Réinitialiser").should("not.exist");
    fieldOf("Date de début").find("input").should("have.value", "");
    cy.wrap(attendanceRequests).should((requests: Query[]) => {
      expect(
        requests.every((query) => query.from === `${ENTRANCE_DATE}T00:00:00Z`)
      ).to.eq(true);
    });
  });

  it("interroge l'API avec le statut et la date de fin choisis", () => {
    mockAttendance(attendanceRequests, (query) =>
      query.attendanceStatus === "PRESENT" ? [] : studentAttendanceMock
    );
    visitManagerParticipation();
    cy.contains("Participation aux événements (5)").should("be.visible");

    selectOption("Statut de présence", "PRESENT");
    fieldOf("Date de fin").find("input").type("2025-06-30");
    fieldOf("Date de début").find("input").clear().type("2024-01-15");
    cy.contains("button", "Appliquer les filtres").click();

    cy.contains("Aucun résultat trouvé").should("be.visible");
    cy.contains(
      "Aucun événement ne correspond aux critères de filtrage sélectionnés."
    ).should("be.visible");
    cy.wrap(attendanceRequests).should((requests: Query[]) => {
      const filtered = requests.find(
        (query) => query.attendanceStatus === "PRESENT"
      );
      expect(filtered?.to).to.eq("2025-06-30T23:59:59Z");
      expect(filtered?.from).to.eq("2024-01-15T00:00:00Z");
    });
  });

  it("indique qu'aucune absence n'est enregistrée", () => {
    mockAttendance(attendanceRequests, () => []);
    visitManagerParticipation();

    cy.contains("Aucune absence enregistrée").should("be.visible");
    cy.contains(
      "Cet étudiant n'a aucune absence pour la période sélectionnée."
    ).should("be.visible");
  });

  it("affiche une erreur quand les participations ne se chargent pas", () => {
    cy.intercept(
      {
        method: "GET",
        pathname: `/students/${participationStudentId}/attendance`,
      },
      {statusCode: 500, body: {message: "boom"}}
    ).as("getAttendanceError");
    navigateInApp(`/students/${participationStudentId}/show?tab=participation`);

    cy.contains("Erreur de chargement").should("be.visible");
    cy.contains(
      "Impossible de charger les données de participation. Veuillez réessayer."
    ).should("be.visible");
  });
});

describe("Détail d'une absence vu par un manager", () => {
  let letterRequests: Query[];

  beforeEach(() => {
    letterRequests = [];
    blockUnmockedApi();
    cy.mockLogin({role: "MANAGER"});
    cy.intercept(
      {method: "GET", pathname: `/students/${participationStudentId}`},
      student1Mock
    );
    mockStudentLevel();
    mockAttendance([]);
    mockLetters(letterRequests);
    visitManagerParticipation();
    cy.contains("Participation aux événements (5)").should("be.visible");
  });

  it("affiche l'événement et tous ses justificatifs", () => {
    cardOf(algoAttendance.title!).click();

    absenceDialog().within(() => {
      cy.contains(algoAttendance.title!).should("be.visible");
      cy.contains(algoAttendance.description!).should("be.visible");
      cy.contains("Salle: SIGMA").should("be.visible");
      cy.contains("Campus: IVANDRY").should("be.visible");
      cy.contains(".MuiChip-root", /^3$/).should("be.visible");
      cy.contains(`Réf: ${pendingLetterMock.ref}`).should("be.visible");
      cy.contains(
        `Approuvé le: ${formatDate(receivedLetterMock.approval_datetime, false)}`
      ).should("be.visible");
      cy.contains(rejectedLetterMock.reason_for_refusal!).should("be.visible");
      cy.contains("John Doe").should("be.visible");
      cy.get('img[alt="profile"]')
        .first()
        .should("have.attr", "src", pendingLetterMock.user?.profile_picture);
      cy.get("button").filter(':contains("Accepter")').should("have.length", 1);
      cy.get("button").filter(':contains("Refuser")').should("have.length", 1);
    });
    cy.wrap(letterRequests).should((requests: Query[]) => {
      expect(requests[0]?.event_id).to.eq(algoAttendance.id);
    });

    cy.contains("button", "Voir le fichier").click();
    cy.contains("h6", `Justificatif - ${pendingLetterMock.ref}`).should(
      "be.visible"
    );
    cy.contains(`Document : ${pendingLetterMock.description}`).should(
      "be.visible"
    );
    closeDialogTitled(`Justificatif - ${pendingLetterMock.ref}`);

    absenceDialog()
      .find("button")
      .filter(':contains("Voir le fichier")')
      .last()
      .click();
    cy.contains("h6", `Justificatif - ${rejectedLetterMock.ref}`).should(
      "be.visible"
    );
    cy.contains("Document : Justificatif").should("be.visible");
    closeDialogTitled(`Justificatif - ${rejectedLetterMock.ref}`);

    closeDialogTitled("Détails de l'absence");
  });

  it("affiche chaque statut et l'absence de justificatif", () => {
    cardOf(examAttendance.title!).click();
    absenceDialog().within(() => {
      cy.contains(".MuiChip-root", "En retard").should("be.visible");
      cy.contains("Campus: ANDRAHARO").should("be.visible");
      cy.contains("Salle:").should("not.exist");
      cy.contains("Aucun justificatif trouvé pour cette absence.").should(
        "be.visible"
      );
    });
    closeDialogTitled("Détails de l'absence");

    cardOf("Seminaire IA").click();
    absenceDialog().within(() => {
      cy.contains(".MuiChip-root", "Présent").should("be.visible");
      cy.contains("Lieu").should("not.exist");
      cy.contains("Description").should("not.exist");
    });
    closeDialogTitled("Détails de l'absence");

    cardOf("Base de donnees").click();
    absenceDialog().within(() => {
      cy.contains(".MuiChip-root", "Non vérifié").should("be.visible");
      cy.contains("Lieu").should("be.visible");
      cy.contains("Campus:").should("not.exist");
    });
    closeDialogTitled("Détails de l'absence");

    cardOf(integrationAttendance.title!).click();
    absenceDialog()
      .contains(".MuiChip-root", "Absence justifiée")
      .should("be.visible");
  });

  it("accepte un justificatif en attente", () => {
    cy.intercept({method: "PUT", pathname: "/letters"}, (req) => {
      req.reply([{...pendingLetterMock, status: "RECEIVED"}]);
    }).as("updateLetter");
    cardOf(algoAttendance.title!).click();

    absenceDialog().contains("button", "Accepter").click();
    confirmDialog("Acceptation du justificatif")
      .contains("button", "Annuler")
      .click();
    cy.contains("Acceptation du justificatif").should("not.exist");

    absenceDialog().contains("button", "Accepter").click();
    confirmDialog("Acceptation du justificatif")
      .contains("button", "Confirmer")
      .click();

    cy.wait("@updateLetter")
      .its("request.body")
      .should("deep.equal", [
        {
          id: pendingLetterMock.id,
          status: "RECEIVED",
          reason_for_refusal: null,
        },
      ]);
    cy.contains("Justificatif accepté avec succès").should("be.visible");
    cy.wrap(letterRequests).should((requests: Query[]) => {
      expect(requests.length).to.be.greaterThan(1);
    });
  });

  it("signale l'échec de l'acceptation d'un justificatif", () => {
    cy.intercept(
      {method: "PUT", pathname: "/letters"},
      {statusCode: 500, body: {message: "boom"}}
    ).as("updateLetterError");
    cardOf(algoAttendance.title!).click();

    absenceDialog().contains("button", "Accepter").click();
    confirmDialog("Acceptation du justificatif")
      .contains("button", "Confirmer")
      .click();

    cy.wait("@updateLetterError").its("response.statusCode").should("eq", 500);
    cy.contains("Erreur lors de l'acceptation du justificatif").should(
      "be.visible"
    );
    cy.contains("Acceptation du justificatif").should("not.exist");
  });

  it("exige une raison puis refuse le justificatif", () => {
    cy.intercept({method: "PUT", pathname: "/letters"}, (req) => {
      req.reply([{...pendingLetterMock, status: "REJECTED"}]);
    }).as("refuseLetter");
    cardOf(algoAttendance.title!).click();

    absenceDialog().contains("button", "Refuser").click();
    confirmDialog("Refus du justificatif")
      .contains("button", "Confirmer")
      .click();
    cy.contains("Veuillez fournir une raison pour le refus.").should(
      "be.visible"
    );

    confirmDialog("Refus du justificatif")
      .find("textarea")
      .first()
      .type("Pièce non conforme");
    confirmDialog("Refus du justificatif")
      .contains("button", "Confirmer")
      .click();

    cy.wait("@refuseLetter")
      .its("request.body")
      .should("deep.equal", [
        {
          id: pendingLetterMock.id,
          status: "REJECTED",
          reason_for_refusal: "Pièce non conforme",
        },
      ]);
    cy.contains("Justificatif refusé avec succès").should("be.visible");
  });

  it("annule puis signale l'échec du refus d'un justificatif", () => {
    cy.intercept(
      {method: "PUT", pathname: "/letters"},
      {statusCode: 500, body: {message: "boom"}}
    ).as("refuseLetterError");
    cardOf(algoAttendance.title!).click();

    absenceDialog().contains("button", "Refuser").click();
    confirmDialog("Refus du justificatif").find("textarea").first().type("x");
    confirmDialog("Refus du justificatif")
      .contains("button", "Annuler")
      .click();
    cy.contains("Refus du justificatif").should("not.exist");

    absenceDialog().contains("button", "Refuser").click();
    confirmDialog("Refus du justificatif")
      .find("textarea")
      .first()
      .should("have.value", "")
      .type("Signature absente");
    confirmDialog("Refus du justificatif")
      .contains("button", "Confirmer")
      .click();

    cy.wait("@refuseLetterError").its("response.statusCode").should("eq", 500);
    cy.contains("Erreur lors du refus du justificatif").should("be.visible");
  });
});

describe("Participation vue par l'étudiant lui-même", () => {
  let attendanceRequests: Query[];
  let letterRequests: Query[];

  const openOwnParticipation = (user: Student) => {
    attendanceRequests = [];
    letterRequests = [];
    blockUnmockedApi();
    cy.mockLogin({role: "STUDENT", user});
    mockStudentLevel();
    mockAttendance(attendanceRequests);
    mockLetters(letterRequests);
    navigateInApp("/profile");
    cy.contains('[role="tab"]', "Participation").click();
  };

  it("consulte ses absences sans pouvoir gérer les justificatifs", () => {
    openOwnParticipation(student1Mock);

    cy.contains("Participation aux événements (5)").should("be.visible");
    cy.wrap(attendanceRequests).should((requests: Query[]) => {
      expect(requests[0]?.from).to.eq(`${ENTRANCE_DATE}T00:00:00Z`);
    });

    cardOf(algoAttendance.title!).click();
    absenceDialog().within(() => {
      cy.contains("button", "Voir le fichier").should("be.visible");
      cy.contains("button", "Accepter").should("not.exist");
      cy.contains("button", "Refuser").should("not.exist");
    });
    cy.wrap(letterRequests).should((requests: Query[]) => {
      expect(requests[0]?.event_id).to.eq(algoAttendance.id);
    });
  });

  it("signale une erreur quand l'étudiant n'a pas de date d'entrée", () => {
    const studentWithoutEntrance: Student = {
      ...student1Mock,
      entrance_datetime: undefined,
    };
    openOwnParticipation(studentWithoutEntrance);

    cy.contains("Erreur de chargement").should("be.visible");
    cy.contains("Participation aux événements").should("not.exist");
    cy.wrap(attendanceRequests).should("have.length", 0);
  });
});
