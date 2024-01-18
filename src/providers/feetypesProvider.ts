import {HaDataProviderType} from "./HaDataProviderType";
import {payingApi} from "./api";

//TODO: remove unecessary mapping
const feetypesProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    return new Promise((resolve, reject)=>{
      const data = [
        {
          id: "feetypes1",
          name: "Ecolage annuelle 1 ans",
          amount: 555,
          type: "TUITION",
          number_of_payments: 5,
          creation_datetime: "2024-01-18T10:30:22.521Z"
        }
      ]
      setTimeout(() => {
        resolve(data);
      }, 1000);
    });
  },
  async getOne(id: string) {
    throw new Error("Not implemented")
  },
  async saveOrUpdate(payload: any) {
    return await payingApi().crupdateFeeType(payload.id, payload)
  },
};

export default feetypesProvider;
