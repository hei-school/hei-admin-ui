describe("getObjValue utility function", () => {
  it("should return correct values for various paths", () => {
    cy.visit("/");

    cy.window()
      .should("have.property", "getObjValue")
      .then((getObjValue: any) => {
        const obj = {a: {b: {c: 42}}, x: 0};

        expect(getObjValue(obj, "a.b.c")).to.eq(42);
        expect(getObjValue(obj, "a.b")).to.deep.eq({c: 42});
        expect(getObjValue(obj, "x")).to.eq(0);
        expect(getObjValue(obj, "not.exist")).to.eq(undefined);
        expect(getObjValue({}, "a.b")).to.eq(undefined);
        expect(getObjValue({a: null}, "a.b")).to.eq(undefined);
      });
  });
});

describe("exportData utility function", () => {
  it("should call exportData without error", () => {
    cy.visit("/");

    cy.window()
      .should("have.property", "exportData")
      .then((exportData: any) => {
        const headers = ["id", "name", "status"];
        const data = [
          {id: 1, name: "Alice", status: "active"},
          {id: 2, name: "Bob", status: "inactive"},
        ];
        expect(() => exportData(data, headers, "test_export")).not.to.throw();
      });
  });
});

describe("commentRenderer utility function", () => {
  it("should render comments correctly", () => {
    cy.visit("/");

    cy.window()
      .should("have.property", "commentRenderer")
      .then((commentRenderer: any) => {
        expect(commentRenderer("Note", 9, 0)).to.eq("Note M1");
        expect(commentRenderer("Note", 9, 2)).to.eq("Note M3");
        expect(commentRenderer("Note", 12, 0)).to.eq("Note");
        expect(commentRenderer("", 9, 0)).to.eq(null);
        expect(commentRenderer("", 12, 0)).to.eq(null);
      });
  });
});

describe("validateData utility function", () => {
  it("should validate data and cover all branches", () => {
    cy.visit("/");

    cy.window()
      .should("have.property", "validateData")
      .then((validateData: any) => {
        let result = validateData([], []);
        expect(result.isValid).to.eq(false);
        expect(result.message).to.contain("Il n'y a pas d'élément à insérer");

        const badHeaders = ["foo", "bar", "baz", "qux", "quux"];
        result = validateData(
          [{foo: 1, bar: 2, baz: 3, qux: 4, quux: 5}],
          badHeaders
        );
        expect(result.isValid).to.eq(true);
        expect(result.message).to.contain("");

        const goodHeaders = [
          "ref",
          "first_name",
          "last_name",
          "email",
          "entrance_datetime",
        ];
        const twenty = Array.from({length: 20}, (_, i) => ({
          ref: `r${i}`,
          first_name: "a",
          last_name: "b",
          email: "c",
          entrance_datetime: "2020-01-01",
        }));
        result = validateData(twenty, goodHeaders);
        expect(result.isValid).to.eq(false);
        expect(result.message).to.contain(
          "Vous ne pouvez importer que 20 éléments"
        );

        const validData = [
          {
            ref: "r1",
            first_name: "a",
            last_name: "b",
            email: "c",
            entrance_datetime: "2020-01-01",
          },
        ];
        result = validateData(validData, goodHeaders);
        expect(result.isValid).to.eq(true);
        expect(result.message).to.eq("");
      });
  });
});

describe("paymentTypeRenderer utility function", () => {
  it("should return the correct payment type object or undefined", () => {
    cy.visit("/");

    cy.window()
      .should("have.property", "paymentTypeRenderer")
      .then((paymentTypeRenderer: any) => {
        const result = paymentTypeRenderer("1");
        if (result) {
          expect(result).to.have.property("id");
          expect(result.id.toString()).to.eq("1");
        } else {
          expect(result).to.eq(undefined);
        }
        const notFound = paymentTypeRenderer("999999");
        expect(notFound).to.eq(undefined);
      });
  });
});

describe("validateUserData and transformUserData utility functions", () => {
  it("should validate and transform user data", () => {
    cy.visit("/");

    cy.window().then((win: any) => {
      expect(win).to.have.property("validateUserData");
      expect(win).to.have.property("transformUserData");

      const minimalUser = {
        ref: "r1",
        first_name: "Alice",
        last_name: "Smith",
        email: "alice@hei.school",
        entrance_datetime: 43831,
      };

      let result = win.validateUserData([minimalUser]);
      expect(result).to.have.property("isValid", true);

      result = win.validateUserData([]);
      expect(result).to.have.property("isValid", false);

      const data = [
        {
          ...minimalUser,
          birth_date: 43831,
          payment_frequency: "mensuel",
          student_refs: "A,B",
        },
      ];
      const transformed = win.transformUserData(data);
      expect(transformed[0]).to.have.property("status");
      expect(transformed[0]).to.have.property("specialization_field");
      expect(transformed[0]).to.have.property("coordinates");
      expect(transformed[0].payment_frequency).to.eq("MONTHLY");
      expect(transformed[0].student_refs).to.deep.eq(["A", "B"]);
    });
  });
});

describe("typo_util functions", () => {
  it("should translate gender, status, fees status, and user role correctly", () => {
    cy.visit("/");

    cy.window().then((win: any) => {
      expect(win.getGenderInFr("M")).to.eq("Homme");
      expect(win.getGenderInFr("F")).to.eq("Femme");
      expect(win.getGenderInFr(null)).to.eq("Non défini.e");
      expect(() => win.getGenderInFr("X")).to.throw();

      expect(win.getUserStatusInFr("ENABLED", "F")).to.eq("Active");
      expect(win.getUserStatusInFr("ENABLED", "M")).to.eq("Actif");
      expect(win.getUserStatusInFr("SUSPENDED", "F")).to.eq("Suspendue");
      expect(win.getUserStatusInFr("SUSPENDED", "M")).to.eq("Suspendu");
      expect(win.getUserStatusInFr("DISABLED", "F")).to.eq("Quittée");
      expect(win.getUserStatusInFr("DISABLED", "M")).to.eq("Quitté");
      expect(() => win.getUserStatusInFr("UNKNOWN", "M")).to.throw();

      expect(win.getFeesStatusInFr("LATE")).to.eq("En retard");
      expect(win.getFeesStatusInFr("PAID")).to.eq("Payé");
      expect(win.getFeesStatusInFr("UNPAID")).to.eq("En cours");
      expect(win.getFeesStatusInFr("PENDING")).to.eq(
        "En cours de vérification"
      );
      expect(() => win.getFeesStatusInFr("UNKNOWN")).to.throw();

      expect(win.getUserRoleInFr("ADMIN", "M")).to.eq("Admin");
      expect(win.getUserRoleInFr("MANAGER", "M")).to.eq("Manager");
      expect(win.getUserRoleInFr("TEACHER", "F")).to.eq("Enseignante");
      expect(win.getUserRoleInFr("TEACHER", "M")).to.eq("Enseignant");
      expect(win.getUserRoleInFr("STUDENT", "F")).to.eq("Étudiante");
      expect(win.getUserRoleInFr("STUDENT", "M")).to.eq("Étudiant");
      expect(win.getUserRoleInFr("MONITOR", "F")).to.eq("Monitrice");
      expect(win.getUserRoleInFr("MONITOR", "M")).to.eq("Moniteur");
      expect(win.getUserRoleInFr("STAFF_MEMBER", "M")).to.eq("Staff");
      expect(win.getUserRoleInFr("ORGANIZER", "F")).to.eq("Organisatrice");
      expect(win.getUserRoleInFr("ORGANIZER", "M")).to.eq("Organisateur");
      expect(() => win.getUserRoleInFr("UNKNOWN", "M")).to.throw();
    });
  });
});

describe("stringifyObj utility function", () => {
  it("should stringify objects correctly", () => {
    cy.visit("/");

    cy.window()
      .should("have.property", "stringifyObj")
      .then((stringifyObj: any) => {
        const obj = {a: 1, b: "test", c: [1, 2, 3]};
        expect(stringifyObj(obj)).to.eq(JSON.stringify(obj));
        expect(stringifyObj(null)).to.eq("null");
        expect(stringifyObj([1, 2, 3])).to.eq("[1,2,3]");
        expect(stringifyObj("abc")).to.eq('"abc"');
      });
  });
});

describe("renderMoney utility function", () => {
  it("should render money with currency and handle undefined/null", () => {
    cy.visit("/");

    cy.window()
      .should("have.property", "renderMoney")
      .then((renderMoney: any) => {
        expect(renderMoney(1000)).to.eq("1000 Ar");
        expect(renderMoney(0)).to.eq("0 Ar");
        expect(renderMoney(undefined)).to.match(/Ar$/);
        expect(renderMoney(null)).to.match(/Ar$/);
      });
  });
});

describe("dayPropGetter basic coverage", () => {
  it("should cover dayPropGetter function", () => {
    cy.visit("/");

    cy.window()
      .should("have.property", "dayPropGetter")
      .then((dayPropGetter: any) => {
        const sunday = new Date("2024-06-30");
        const res1 = dayPropGetter(sunday);
        expect(res1.style.display).to.eq("none");

        const monday = new Date("2024-07-01");
        const res2 = dayPropGetter(monday);
        expect(res2.style.display).to.eq("block");
      });
  });
});

describe("eventStyleGetter basic coverage", () => {
  it("should fully cover eventStyleGetter logic", () => {
    cy.visit("/");

    cy.window()
      .should("have.property", "eventStyleGetter")
      .then((eventStyleGetter: any) => {
        const eventWithColor = {color: "#FF0000"};
        const res1 = eventStyleGetter(eventWithColor);
        expect(res1).to.have.property("style");
        expect(res1.style.backgroundColor).to.eq("#FF0000");
        expect(res1.style.borderRadius).to.eq("10px");
        expect(res1.style.border).to.eq("2px solid white");
        expect(res1.style.fontWeight).to.eq("bold");
        expect(res1.style.color).to.eq("white");

        const eventWithoutColor = {};
        const res2 = eventStyleGetter(eventWithoutColor);
        expect(res2.style.backgroundColor).to.eq("defaultColor");
        expect(res2.style.borderRadius).to.eq("10px");
        expect(res2.style.border).to.eq("2px solid white");
        expect(res2.style.fontWeight).to.eq("bold");
        expect(res2.style.color).to.eq("white");

        const eventUndefinedColor = {color: undefined};
        const res3 = eventStyleGetter(eventUndefinedColor);
        expect(res3.style.backgroundColor).to.eq("defaultColor");
      });
  });
});

describe("transformApiDataToCalendarEvents basic coverage", () => {
  it("should cover transformApiDataToCalendarEvents logic", () => {
    cy.visit("/");

    cy.window()
      .should("have.property", "transformApiDataToCalendarEvents")
      .then((transformApiDataToCalendarEvents: any) => {
        const res1 = transformApiDataToCalendarEvents("not-an-array");
        expect(res1).to.deep.eq([]);

        const res2 = transformApiDataToCalendarEvents([]);
        expect(res2).to.deep.eq([]);

        const res3 = transformApiDataToCalendarEvents([null, undefined]);
        expect(res3).to.deep.eq([]);

        const eventCourse = {
          id: "evt1",
          type: "COURSE",
          course: {code: "CS101"},
          groups: [{ref: "G1", name: "Groupe 1"}],
          title: "Introduction",
          begin_datetime: "2024-07-01T08:00:00.000Z",
          end_datetime: "2024-07-01T10:00:00.000Z",
          description: "Cours d'introduction",
          color: "#123456",
        };

        const res4 = transformApiDataToCalendarEvents([eventCourse]);
        expect(res4).to.have.length(1);
        expect(res4[0]).to.include({
          id: "evt1",
          description: "Cours d'introduction",
          groupName: "Groupe 1",
          color: "#123456",
        });
        expect(res4[0].title).to.contain("[G1] Cours (CS101) - Introduction");

        expect(new Date(res4[0].start).toISOString()).to.eq(
          "2024-07-01T08:00:00.000Z"
        );
        expect(new Date(res4[0].end).toISOString()).to.eq(
          "2024-07-01T10:00:00.000Z"
        );

        const eventOther = {
          id: "evt2",
          type: "EXAM",
          groups: [],
          title: "Final Exam",
          begin_datetime: null,
          end_datetime: null,
          description: "",
          color: "#654321",
        };

        const res5 = transformApiDataToCalendarEvents([eventOther]);
        expect(res5).to.have.length(1);
        expect(res5[0].title).to.contain("Examen - Final Exam");
        expect(res5[0].start).to.be.null;
        expect(res5[0].end).to.be.null;
        expect(res5[0].description).to.eq("Pas de description");
        expect(res5[0].groupName).to.eq("Pas de groupe");
        expect(res5[0].color).to.eq("#654321");
      });
  });
});
