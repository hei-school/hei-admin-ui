import receiptProvider from "@/providers/receiptProvider";

describe("Receipt Provider Test", () => {
  const mockReceiptId = "test-id";

  describe("Unimplemented methods", () => {
    const ERROR_MESSAGE = "Not Implemented";

    it("getList() should throw an error", () => {
      expect(() => receiptProvider.getList(1, 10, {})).to.throw(ERROR_MESSAGE);
    });

    it("delete() should throw an error", () => {
      expect(() => receiptProvider.delete(mockReceiptId)).to.throw(
        ERROR_MESSAGE
      );
    });
  });
});
