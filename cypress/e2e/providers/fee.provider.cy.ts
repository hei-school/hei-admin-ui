import feeProvider, {
  feeIdFromRaId,
  studentIdFromRaId,
  toApiIds,
  toRaId,
} from "@/providers/feeProvider";
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
  });
});
