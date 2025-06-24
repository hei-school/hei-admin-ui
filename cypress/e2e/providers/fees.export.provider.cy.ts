import {payingApi} from "@/providers/api";
import feesExportProvider from "@/providers/feesExportProvider";

describe("Fees Export Provider", () => {
  const mockId = "export-123";
  const mockArrayBuffer = new ArrayBuffer(8);
  const mockResponse = {data: mockArrayBuffer};

  beforeEach(() => {
    cy.stub(payingApi(), "generateFeesListAsXlsx").resolves(mockResponse);
    cy.intercept("GET", `/fees/raw?*`, {});
  });

  describe("getOne()", () => {
    const testCases = [
      {
        description: "with all filters",
        meta: {
          status: "paid",
          fromDueDatetime: "2023-01-01",
          toDueDatetime: "2023-12-31",
        },
        expectedCall: [
          "paid",
          "2023-01-01",
          "2023-12-31",
          {responseType: "arraybuffer"},
        ],
      },
      {
        description: "with only status filter",
        meta: {status: "unpaid"},
        expectedCall: [
          "unpaid",
          undefined,
          undefined,
          {responseType: "arraybuffer"},
        ],
      },
      {
        description: "with date range only",
        meta: {
          fromDueDatetime: "2023-06-01",
          toDueDatetime: "2023-06-30",
        },
        expectedCall: [
          undefined,
          "2023-06-01",
          "2023-06-30",
          {responseType: "arraybuffer"},
        ],
      },
      {
        description: "with empty meta",
        meta: {},
        expectedCall: [
          undefined,
          undefined,
          undefined,
          {responseType: "arraybuffer"},
        ],
      },
    ];

    testCases.forEach(({description, meta, expectedCall}) => {
      it(`should call API correctly ${description}`, () => {
        feesExportProvider.getOne(mockId, meta).then(() => {
          expect(payingApi().generateFeesListAsXlsx).to.have.been.calledWith(
            ...expectedCall
          );
        });
      });

      it("should return correct response structure", () => {
        feesExportProvider.getOne(mockId, {}).then((result) => {
          expect(result).to.deep.equal({
            id: mockId,
            file: mockArrayBuffer,
          });
        });
      });

      it("should handle API errors", () => {
        const error = new Error("API failure");
        cy.stub(payingApi(), "generateFeesListAsXlsx").rejects(error);
        feesExportProvider.getOne(mockId, {}).catch((err) => {
          expect(err).to.equal(error);
        });
      });
    });
  });

  describe("unimplemented methods", () => {
    it("getList() should throw an error", () => {
      expect(() => feesExportProvider.getList(1, 10, {})).to.throw(
        "Not implemented"
      );
    });

    it("saveOrUpdate() should throw an error", () => {
      expect(() => feesExportProvider.saveOrUpdate({})).to.throw(
        "Not implemented"
      );
    });

    it.skip("delete() should throw an error", () => {
      expect(() => feesExportProvider.delete("")).to.throw("Not implemented");
    });
  });
});
