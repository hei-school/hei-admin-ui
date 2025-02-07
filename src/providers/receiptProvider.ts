import {ZipReceiptsRequest} from "@haapi/typescript-client";
import {payingApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const receiptProvider: HaDataProviderType = {
  getList() {
    throw new Error("Function not implemented.");
  },

  async getOne(id: string, meta: any) {
    const {paymentId: raId} = meta;
    const [, feeId, paymentId] = raId.split("--");

    return payingApi()
      .getPaidFeeReceipt(id, feeId, paymentId, {responseType: "arraybuffer"})
      .then((res) => ({id, file: res.data}));
  },

  async saveOrUpdate(payload: (ZipReceiptsRequest & {id: string})[]) {
    if (Array.isArray(payload) && payload.length != 1) {
      throw new Error(
        "Unexpected payload was received, must be an array of one payload"
      );
    }

    const [receiptPayload] = payload;
    return payingApi()
      .getZipFeeReceipts(receiptPayload)
      .then((res) => [{...res.data, id: receiptPayload.id}]);
  },

  delete() {
    throw new Error("Function not implemented.");
  },
};

export default receiptProvider;
