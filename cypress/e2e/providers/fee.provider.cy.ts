import feeProvider, {
  feeIdFromRaId,
  studentIdFromRaId,
  toApiIds,
  toRaId,
} from "@/providers/feeProvider";
import {v4 as uuid} from "uuid";
import {fee1Mock, feesMock} from "../../fixtures/api_mocks/fees-mocks";
import {student1Mock} from "../../fixtures/api_mocks/students-mocks";

describe("Fee Provider", () => {
  const studentId = student1Mock.id;
  const feeId = fee1Mock.id as string;
  const raId = toRaId(studentId, feeId);

  describe("Utility Functions", () => {
    describe("toRaId()", () => {
      it("should convert student and fee IDs to RA ID", () => {
        const result = toRaId(studentId, feeId);
        expect(result).to.equal(`${studentId}--${feeId}`);
      });
    });

    describe("toApiIds()", () => {
      it("should extract student and fee IDs from RA ID", () => {
        const result = toApiIds(raId);
        expect(result.studentId).to.equal(studentId);
        expect(result.feeId).to.equal(feeId);
      });
    });

    describe("studentIdFromRaId()", () => {
      it("should extract student ID from RA ID", () => {
        const result = studentIdFromRaId(raId);
        expect(result).to.equal(studentId);
      });
    });

    describe("feeIdFromRaId()", () => {
      it("should extract fee ID from RA ID", () => {
        const result = feeIdFromRaId(raId);
        expect(result).to.equal(feeId);
      });
    });
  });

  describe("getList()", () => {
    context("when getting fees for a specific student", () => {
      it("should get fees correctly", () => {
        const page = 1;
        const perPage = 10;
        const filter = {studentId: studentId};

        cy.intercept(
          "GET",
          `/students/${studentId}/fees?page=${page}&page_size=${perPage}`,
          feesMock
        ).as("getStudentFees");
        feeProvider.getList(page, perPage, filter).then((result) => {
          cy.wait("@getStudentFees");
          expect(result.data).to.have.length(feesMock.length);
          result.data.forEach((fee, index) => {
            expect(fee.id).to.equal(
              toRaId(feesMock[index].student_id!, feesMock[index].id!)
            );
            expect(fee).to.include(feesMock[index]);
          });
        });
      });
    });

    context("when getting fees without a specific student ID", () => {
      const page = 1;
      const perPage = 10;
      const filter = {
        transaction_status: "SUCCESS",
        type: "TUITION",
        status: "UNPAID",
        monthFrom: "2022-01",
        monthTo: "2022-12",
        isMpbs: true,
        student_ref: "STD123",
      };

      const buildQueryString = (params: Record<string, unknown>) =>
        Object.entries(params)
          .map(([key, value]) => `${key}=${value}`)
          .join("&");

      const query = buildQueryString({
        transaction_status: filter.transaction_status,
        type: filter.type,
        status: filter.status,
        month_from: filter.monthFrom,
        month_to: filter.monthTo,
        page,
        page_size: perPage,
        is_mpbs: filter.isMpbs,
        student_ref: filter.student_ref,
      });

      it("should get fees correctly with various filters", () => {
        cy.intercept("GET", `/fees?${query}`, {
          data: {data: feesMock},
        }).as("getFees");
        feeProvider.getList(page, perPage, filter).then((result) => {
          cy.wait("@getFees");
          expect(result.data).to.have.length(feesMock.length);
          result.data.forEach((fee, index) => {
            expect(fee.id).to.equal(
              toRaId(feesMock[index].student_id!, feesMock[index].id!)
            );
            expect(fee).to.include(feesMock[index]);
          });
        });
      });
    });
  });

  describe("getOne()", () => {
    it("should get a single fee by ID", () => {
      cy.intercept("GET", `/students/${studentId}/fees/${feeId}`, fee1Mock).as(
        "getFee"
      );
      cy.intercept("GET", `/students/${studentId}/fees/${feeId}`).as("getFee");
      cy.then(() => {
        return feeProvider.getOne(raId);
      }).then((result) => {
        expect(result.id).to.equal(raId);
        expect(result.student_id).to.equal(studentId);
        expect(result.remaining_amount).to.equal(fee1Mock.remaining_amount);
      });
      cy.wait("@getFee");
    });
  });

  describe("saveOrUpdate()", () => {
    it("should create a mobile payment (mpbs)", () => {
      const mpbsId = uuid();
      const pspId = "reference123";
      const pspType = "MVOLA";
      const payload = {
        fee_id: raId,
        student_id: studentId,
        psp_id: pspId,
        psp_type: pspType,
        mpbs_id: mpbsId,
      };
      cy.intercept("PUT", `/students/${studentId}/fees/${feeId}/mpbs`, {
        statusCode: 200,
        body: payload,
      }).as("createMpbs");
      cy.wrap(feeProvider.saveOrUpdate([payload])).as("savePromise");
      cy.wait("@createMpbs");
      cy.get("@savePromise").then((result: unknown) => {
        const data = result as {
          fee_id: string;
          student_id: string;
          psp_id: string;
          psp_type: string;
        }[];
        expect(data[0].fee_id).to.equal(raId);
        expect(data[0].student_id).to.equal(studentId);
        expect(data[0].psp_id).to.equal(pspId);
        expect(data[0].psp_type).to.equal(pspType);
      });
    });

    /* FIXME */
    it("should create fees as a student", () => {});

    /* FIXME */
    it("should create/update fees as a manager", () => {});
  });

  describe("delete()", () => {
    it("should delete a fee", () => {
      cy.intercept("DELETE", `/students/${studentId}/fees/${feeId}`, {
        statusCode: 200,
        body: fee1Mock,
      }).as("deleteFee");
      cy.wrap(feeProvider.delete(raId)).as("deletePromise");
      cy.wait("@deleteFee");
      cy.get("@deletePromise").then((result) => {
        const plainResult = JSON.parse(JSON.stringify(result));
        const plainExpected = JSON.parse(JSON.stringify(fee1Mock));
        expect(plainResult).to.deep.equal(plainExpected);
      });
    });
  });
});
