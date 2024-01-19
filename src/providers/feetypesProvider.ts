import {HaDataProviderType} from "./HaDataProviderType";
import {payingApi} from "./api";

//TODO: Fix after waiting for the backend specification and implementation
const feetypesProvider: HaDataProviderType = {
  async getList(page: number, perPage: number, filter: any) {
    return new Promise((resolve, reject)=>{
      const data = [
        {
          id: "feetypes1",
          name: "Ecolage annuelle 1 ans",
          amount: 1_900_000,
          type: "TUITION",
          number_of_payments: 1,
          creation_datetime: "2024-01-18T10:30:22.521Z"
        },
        {
          id: "feetypes2",
          name: "Ecolage annuelle 1 x9",
          amount: 240_000,
          type: "TUITION",
          number_of_payments: 9,
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
