import {payingApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

const receiptProvider: HaDataProviderType = {
  async getList() {
    throw new Error("Function not implemented.");
  },

  async getOne(id: string, meta: any) {
    const {paymentId: raId} = meta;
    const [studentId, feeId, paymentId] = raId.split("--");

    const response = await payingApi().getPaidFeeReceipt(id, feeId, paymentId, {
      responseType: "arraybuffer",
    });
    if (!response || !response.data) {
      throw new Error("No PDF content found");
    }

    return {
      id: id,
      data: response.data,
    };
  },

  async saveOrUpdate() {
    throw new Error("Function not implemented.");
  },

  async delete() {
    throw new Error("Function not implemented.");
  },
};

export default receiptProvider;
