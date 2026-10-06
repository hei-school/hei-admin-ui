import {
  GeneratedReceiptsStatistic,
  GenerationReceiptsRequest,
} from "@haapi-b0fc7615/typescript-client";
import {payingApi} from "./api";
import {
  HaDataProviderType,
  HaFilter,
  notImplemented,
} from "./HaDataProviderType";
import {ExportedFile} from "./types";

interface ReceiptMeta {
  paymentId: string;
}

type ReceiptsGeneration = GenerationReceiptsRequest & {id: string};

const receiptProvider: HaDataProviderType<
  ExportedFile,
  HaFilter,
  ReceiptMeta,
  ReceiptsGeneration[],
  unknown,
  Array<GeneratedReceiptsStatistic & {id: string}>
> = {
  getList: notImplemented,

  getOne: async (id: string, meta: ReceiptMeta) => {
    const {paymentId: raId} = meta;
    const [, feeId, paymentId] = raId.split("--");

    return payingApi()
      .getPaidFeeReceipt(id, feeId, paymentId, {responseType: "arraybuffer"})
      .then((res) => ({id, file: res.data}));
  },

  saveOrUpdate: async (payload: ReceiptsGeneration[]) => {
    if (Array.isArray(payload) && payload.length != 1) {
      throw new Error(
        "Unexpected payload was received, must be an array of one payload"
      );
    }

    const [receiptPayload] = payload;
    return payingApi()
      .generateFeeReceipts(receiptPayload)
      .then((res) => [{...res.data, id: receiptPayload.id}]);
  },

  delete: notImplemented,
};

export default receiptProvider;
