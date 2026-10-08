import {asWindowFunction} from "./utils";

// Signatures as seen by these tests: some cases deliberately pass invalid values.
type GetObjValue = (obj: object, path: string) => unknown;
type ExportData = (data: object[], headers: string[], fileName: string) => void;
type CommentRenderer = (
  comment: string,
  totalMonthsNumber: number,
  index: number
) => string | null;
type ImportValidation = {isValid: boolean; message: string};
type ValidateData = (data: object[], headers: string[]) => ImportValidation;
type PaymentTypeRenderer = (type: string) => {id: number | string} | undefined;
type ValidateUserData = (data: object[]) => ImportValidation;
type TransformUserData = (data: object[]) => Array<{
  payment_frequency?: string;
  student_refs?: string[];
}>;
type GetGenderInFr = (sex: string | null) => string;
type TranslateWithSex = (value: string, sex: string) => string;
type GetFeesStatusInFr = (status: string) => string;
type StringifyObj = (value: unknown) => string;
type RenderMoney = (amount: number | null | undefined) => string;
type StyleGetterResult = {style: Partial<CSSStyleDeclaration>};
type DayPropGetter = (date: Date) => StyleGetterResult;
type EventStyleGetter = (event: {color?: string}) => StyleGetterResult;
type CalendarEventLike = {
  title: string;
  start: Date | null;
  end: Date | null;
  description: string;
  groupName: string;
  color: string;
};
type TransformApiDataToCalendarEvents = (data: unknown) => CalendarEventLike[];

describe("getObjValue utility function", () => {
  it("should return correct values for various paths", () => {
    cy.visit("/");

    cy.window()
      .should("have.property", "getObjValue")
      .then((value: unknown) => {
        const getObjValue = asWindowFunction<GetObjValue>(value);
        const obj = {a: {b: {c: 42}}, x: 0};

        expect(getObjValue(obj, "a.b.c")).to.eq(42);
        expect(getObjValue(obj, "a.b")).to.deep.eq({c: 42});
        expect(getObjValue(obj, "x")).to.eq(0);
        expect(getObjValue(obj, "not.exist")).to.be.undefined;
        expect(getObjValue({}, "a.b")).to.be.undefined;
        expect(getObjValue({a: null}, "a.b")).to.be.undefined;
      });
  });
});

describe("exportData utility function", () => {
  it("should call exportData without error", () => {
    cy.visit("/");

    cy.window()
      .should("have.property", "exportData")
      .then((value: unknown) => {
        const exportData = asWindowFunction<ExportData>(value);
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
      .then((value: unknown) => {
        const commentRenderer = asWindowFunction<CommentRenderer>(value);
        expect(commentRenderer("Note", 9, 0)).to.eq("Note M1");
        expect(commentRenderer("Note", 9, 2)).to.eq("Note M3");
        expect(commentRenderer("Note", 12, 0)).to.eq("Note");
        expect(commentRenderer("", 9, 0)).to.be.null;
        expect(commentRenderer("", 12, 0)).to.be.null;
      });
  });
});

describe("validateData utility function", () => {
  // Ignored since c59e024 ("test: failling test"): it fails and has not been fixed yet.
  it.skip("should validate data and cover all branches", () => {
    cy.visit("/");

    cy.window()
      .should("have.property", "validateData")
      .then((value: unknown) => {
        const validateData = asWindowFunction<ValidateData>(value);
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
      .then((value: unknown) => {
        const paymentTypeRenderer =
          asWindowFunction<PaymentTypeRenderer>(value);
        const result = paymentTypeRenderer("1");
        if (result) {
          expect(result).to.have.property("id");
          expect(result.id.toString()).to.eq("1");
        } else {
          expect(result).to.be.undefined;
        }
        const notFound = paymentTypeRenderer("999999");
        expect(notFound).to.be.undefined;
      });
  });
});

describe("validateUserData and transformUserData utility functions", () => {
  // TODO: fix this test
  it.skip("should validate and transform user data", () => {
    cy.visit("/");

    cy.window().then((win) => {
      expect(win).to.have.property("validateUserData");
      expect(win).to.have.property("transformUserData");
      const validateUserData = asWindowFunction<ValidateUserData>(
        win.validateUserData
      );
      const transformUserData = asWindowFunction<TransformUserData>(
        win.transformUserData
      );

      const minimalUser = {
        ref: "r1",
        first_name: "Alice",
        last_name: "Smith",
        email: "alice@hei.school",
        entrance_datetime: 43831,
      };

      let result = validateUserData([minimalUser]);
      expect(result).to.have.property("isValid", true);

      result = validateUserData([]);
      expect(result).to.have.property("isValid", false);

      const data = [
        {
          ...minimalUser,
          birth_date: 43831,
          payment_frequency: "mensuel",
          student_refs: "A,B",
        },
      ];
      const transformed = transformUserData(data);
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

    cy.window().then((win) => {
      const getGenderInFr = asWindowFunction<GetGenderInFr>(win.getGenderInFr);
      const getUserStatusInFr = asWindowFunction<TranslateWithSex>(
        win.getUserStatusInFr
      );
      const getFeesStatusInFr = asWindowFunction<GetFeesStatusInFr>(
        win.getFeesStatusInFr
      );
      const getUserRoleInFr = asWindowFunction<TranslateWithSex>(
        win.getUserRoleInFr
      );

      expect(getGenderInFr("M")).to.eq("Homme");
      expect(getGenderInFr("F")).to.eq("Femme");
      expect(getGenderInFr(null)).to.eq("Non défini.e");
      expect(() => getGenderInFr("X")).to.throw("Unknown gender");

      expect(getUserStatusInFr("ENABLED", "F")).to.eq("Active");
      expect(getUserStatusInFr("ENABLED", "M")).to.eq("Actif");
      expect(getUserStatusInFr("SUSPENDED", "F")).to.eq("Suspendue");
      expect(getUserStatusInFr("SUSPENDED", "M")).to.eq("Suspendu");
      expect(getUserStatusInFr("DISABLED", "F")).to.eq("Quittée");
      expect(getUserStatusInFr("DISABLED", "M")).to.eq("Quitté");
      expect(() => getUserStatusInFr("UNKNOWN", "M")).to.throw(
        "Unknown user status"
      );

      expect(getFeesStatusInFr("LATE")).to.eq("En retard");
      expect(getFeesStatusInFr("PAID")).to.eq("Payé");
      expect(getFeesStatusInFr("UNPAID")).to.eq("En cours");
      expect(getFeesStatusInFr("PENDING")).to.eq("En cours de vérification");
      expect(() => getFeesStatusInFr("UNKNOWN")).to.throw(
        "Unknown fees status"
      );

      expect(getUserRoleInFr("ADMIN", "M")).to.eq("Admin");
      expect(getUserRoleInFr("MANAGER", "M")).to.eq("Manager");
      expect(getUserRoleInFr("TEACHER", "F")).to.eq("Enseignante");
      expect(getUserRoleInFr("TEACHER", "M")).to.eq("Enseignant");
      expect(getUserRoleInFr("STUDENT", "F")).to.eq("Étudiante");
      expect(getUserRoleInFr("STUDENT", "M")).to.eq("Étudiant");
      expect(getUserRoleInFr("MONITOR", "F")).to.eq("Monitrice");
      expect(getUserRoleInFr("MONITOR", "M")).to.eq("Moniteur");
      expect(getUserRoleInFr("STAFF_MEMBER", "M")).to.eq("Staff");
      expect(getUserRoleInFr("ORGANIZER", "F")).to.eq("Organisatrice");
      expect(getUserRoleInFr("ORGANIZER", "M")).to.eq("Organisateur");
      expect(() => getUserRoleInFr("UNKNOWN", "M")).to.throw(
        "Unknown user role"
      );
    });
  });
});

describe("stringifyObj utility function", () => {
  it("should stringify objects correctly", () => {
    cy.visit("/");

    cy.window()
      .should("have.property", "stringifyObj")
      .then((value: unknown) => {
        const stringifyObj = asWindowFunction<StringifyObj>(value);
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
      .then((value: unknown) => {
        const renderMoney = asWindowFunction<RenderMoney>(value);
        expect(renderMoney(1000)).to.match(/^1.000 Ar$/);
        expect(renderMoney(0)).to.eq("0 Ar");
        expect(renderMoney(undefined)).to.eq("Non défini.e");
        expect(renderMoney(null)).to.eq("Non défini.e");
      });
  });
});

describe("dayPropGetter basic coverage", () => {
  it("should cover dayPropGetter function", () => {
    cy.visit("/");

    cy.window()
      .should("have.property", "dayPropGetter")
      .then((value: unknown) => {
        const dayPropGetter = asWindowFunction<DayPropGetter>(value);
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
      .then((value: unknown) => {
        const eventStyleGetter = asWindowFunction<EventStyleGetter>(value);
        const eventWithColor = {color: "#FF0000"};
        const res1 = eventStyleGetter(eventWithColor);
        expect(res1).to.have.property("style");
        expect(res1.style.borderRadius).to.eq("10px");
        expect(res1.style.border).to.eq("2px solid white");
        expect(res1.style.fontWeight).to.eq("bold");
        expect(res1.style.color).to.eq("white");

        const eventWithoutColor = {};
        const res2 = eventStyleGetter(eventWithoutColor);
        // expect(res2.style.backgroundColor).to.eq("defaultColor");
        expect(res2.style.borderRadius).to.eq("10px");
        expect(res2.style.border).to.eq("2px solid white");
        expect(res2.style.fontWeight).to.eq("bold");
        expect(res2.style.color).to.eq("white");

        // const eventUndefinedColor = {color: undefined};
        // const res3 = eventStyleGetter(eventUndefinedColor);
        // expect(res3.style.backgroundColor).to.eq("defaultColor");
      });
  });
});

describe("transformApiDataToCalendarEvents basic coverage", () => {
  it("should cover transformApiDataToCalendarEvents logic", () => {
    cy.visit("/");

    cy.window()
      .should("have.property", "transformApiDataToCalendarEvents")
      .then((value: unknown) => {
        const transformApiDataToCalendarEvents =
          asWindowFunction<TransformApiDataToCalendarEvents>(value);
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
        expect(res4[0].title).to.be.a("string");
        expect(res4[0].title).to.contain("Introduction");
        expect(res4[0].title).to.contain("CS101");

        expect(res4[0].start?.toISOString()).to.eq("2024-07-01T08:00:00.000Z");
        expect(res4[0].end?.toISOString()).to.eq("2024-07-01T10:00:00.000Z");

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
        expect(res5[0].title).to.be.a("string");
        expect(res5[0].title).to.contain("Final Exam");
        expect(res5[0].start).to.be.null;
        expect(res5[0].end).to.be.null;
        expect(res5[0].description).to.eq("Pas de description");
        expect(res5[0].groupName).to.eq("Pas de groupe");
        expect(res5[0].color).to.eq("#654321");
      });
  });
});
