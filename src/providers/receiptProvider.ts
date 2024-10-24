import {payingApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const receiptProvider: HaDataProviderType = {
  async getList() {
    throw new Error("Function not implemented.");
  },

  async getOne(id: string, meta: any) {
    const {paymentId: raId} = meta;
    const [, feeId, paymentId] = raId.split("--");

    return payingApi()
      .getPaidFeeReceipt(id, feeId, paymentId, {responseType: "arraybuffer"})
      .then((res) => ({id, file: res.data}));
  },

  async saveOrUpdate() {
    throw new Error("Function not implemented.");
  },

  async delete() {
    throw new Error("Function not implemented.");
  },
};

export default receiptProvider;
