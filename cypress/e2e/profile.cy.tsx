import {WhoamiRoleEnum} from "@haapi/typescript-client";
import {admin1Mock} from "../fixtures/api_mocks/admins-mock";
import {manager1Mock} from "../fixtures/api_mocks/managers-mocks";
import {monitor1Mock} from "../fixtures/api_mocks/monitors-mock";
import {organizer1Mock} from "../fixtures/api_mocks/organizers-mock";
import {staff1Mock} from "../fixtures/api_mocks/staffs-mock";
import {student1Mock} from "../fixtures/api_mocks/students-mocks";
import {teacher1Mock} from "../fixtures/api_mocks/teachers-mocks";

describe("Admin profile test", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.ADMIN});
  });

  it("can view his own profile as admin", () => {
    cy.contains("Profil").click();
    cy.contains("Détails du Profil");
    cy.contains("Boîte aux lettres");
    cy.contains("Email");
    cy.contains(admin1Mock.email);
    cy.contains("Téléphone");
    cy.contains(admin1Mock.phone);
    cy.contains("Adresse");
    cy.contains(admin1Mock.address);
    cy.contains("Géolocalisation");
    cy.contains("Sexe");
    cy.contains("Numéro CIN");
    cy.contains("Date et lieu de naissance");
    cy.contains("Statut");
    cy.contains("Date d'entrée chez HEI");
  });
});

describe("Manager profile test", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.MANAGER});
  });

  it("can view his own profile as manager", () => {
    cy.contains("Profil").click();
    cy.contains("Détails du Profil");
    cy.contains("Boîte aux lettres");
    cy.contains("Email");
    cy.contains(manager1Mock.email);
    cy.contains("Téléphone");
    cy.contains(manager1Mock.phone);
    cy.contains("Adresse");
    cy.contains(manager1Mock.address);
    cy.contains("Géolocalisation");
    cy.contains(manager1Mock.nic);
    cy.contains("Sexe");
    cy.contains("Numéro CIN");
    cy.contains("Date et lieu de naissance");
    cy.contains("Statut");
    cy.contains("Date d'entrée chez HEI");
    cy.contains("Se déconnecter").click();
  });
});

describe("Teacher profile test", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.TEACHER});
  });

  it("can view his own profile as teacher", () => {
    cy.contains("Détails du Profil");
    cy.contains("Boîte aux lettres");
    cy.contains("Email");
    cy.contains(teacher1Mock.email);
    cy.contains("Téléphone");
    cy.contains(teacher1Mock.phone);
    cy.contains("Adresse");
    cy.contains(teacher1Mock.address);
    cy.contains("Géolocalisation");
    cy.contains(teacher1Mock.nic);
    cy.contains("Sexe");
    cy.contains("Numéro CIN");
    cy.contains("Date et lieu de naissance");
    cy.contains("Statut");
    cy.contains("Date d'entrée chez HEI");
  });
});

describe("Monitor profile test", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.MONITOR});
  });

  it("can view his own profile as monitor", () => {
    cy.contains("Profil").click();
    cy.contains("Détails du Profil");
    cy.contains("Email");
    cy.contains(monitor1Mock.email);
    cy.contains("Téléphone");
    cy.contains(monitor1Mock.phone);
    cy.contains("Adresse");
    cy.contains(monitor1Mock.address);
    cy.contains("Géolocalisation");
    cy.contains("Sexe");
    cy.contains("Numéro CIN");
    cy.contains("Date et lieu de naissance");
    cy.contains("Statut");
    cy.contains("Date d'entrée chez HEI");
  });
});

describe("Student profile test", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.STUDENT});
  });

  it("can view his own profile as student", () => {
    cy.contains("Profil").click();
    cy.contains("Détails du Profil");
    cy.contains("Email");
    cy.contains(student1Mock.email);
    cy.contains("Téléphone");
    cy.contains(student1Mock.phone);
    cy.contains("Adresse");
    cy.contains(student1Mock.address);
    cy.contains("Géolocalisation");
    cy.contains("Sexe");
    cy.contains("Numéro CIN");
    cy.contains("Date et lieu de naissance");
    cy.contains("Statut");
    cy.contains("Date d'entrée chez HEI");
  });
});

describe("Staff profile test", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.STAFF_MEMBER});
  });

  it("can view his own profile as staff", () => {
    cy.contains("Profil").click();
    cy.contains("Détails du Profil");
    cy.contains("Email");
    cy.contains(staff1Mock.email);
    cy.contains("Téléphone");
    cy.contains(staff1Mock.phone);
    cy.contains("Adresse");
    cy.contains(staff1Mock.address);
    cy.contains("Géolocalisation");
    cy.contains("Sexe");
    cy.contains("Numéro CIN");
    cy.contains("Date et lieu de naissance");
    cy.contains("Statut");
    cy.contains("Date d'entrée chez HEI");
  });
});

describe("Organizer profile test", () => {
  beforeEach(() => {
    cy.mockLogin({role: WhoamiRoleEnum.ORGANIZER});
  });

  it("can view his own profile as organizer", () => {
    cy.contains("Profil").click();
    cy.contains("Détails du Profil");
    cy.contains("Email");
    cy.contains(organizer1Mock.email);
    cy.contains("Téléphone");
    cy.contains(organizer1Mock.phone);
    cy.contains("Adresse");
    cy.contains(organizer1Mock.address);
    cy.contains("Géolocalisation");
    cy.contains("Sexe");
    cy.contains("Numéro CIN");
    cy.contains("Date et lieu de naissance");
    cy.contains("Statut");
    cy.contains("Date d'entrée chez HEI");
  });
});
