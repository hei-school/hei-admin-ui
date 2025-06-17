import {
  feeIdFromRaId,
  studentIdFromRaId,
  toApiIds,
  toRaId,
} from "@/providers/feeProvider";
import {fee1Mock} from "../../fixtures/api_mocks/fees-mocks";
import {student1Mock} from "../../fixtures/api_mocks/students-mocks";

describe("Fee Provider", () => {
  const studentId = student1Mock.id;
  const feeId = fee1Mock.id as string;
  const raId = toRaId(studentId, feeId);

  describe("Utility Functions", () => {
    it("should convert student and fee IDs to RA ID", () => {
      const result = toRaId(studentId, feeId);
      expect(result).to.equal(`${studentId}--${feeId}`);
    });

    it("should extract student and fee IDs from RA ID", () => {
      const result = toApiIds(raId);
      expect(result.studentId).to.equal(studentId);
      expect(result.feeId).to.equal(feeId);
    });

    it("should extract student ID from RA ID", () => {
      const result = studentIdFromRaId(raId);
      expect(result).to.equal(studentId);
    });

    it("should extract fee ID from RA ID", () => {
      const result = feeIdFromRaId(raId);
      expect(result).to.equal(feeId);
    });
  });
});
