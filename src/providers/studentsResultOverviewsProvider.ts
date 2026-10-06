import {
  ResultOverviewStatus,
  StudentResultOverview,
} from "@haapi-b0fc7615/typescript-client";
import {usersApi} from "./api";
import {HaDataProviderType} from "./HaDataProviderType";

interface StudentsResultOverviewFilter {
  status: ResultOverviewStatus;
  promotionId: string;
}

type StudentResultOverviewRecord = StudentResultOverview & {
  id: string | number;
};

const studentsResultOverviewProvider: HaDataProviderType<
  StudentResultOverviewRecord,
  StudentsResultOverviewFilter
> = {
  getList: async (
    page: number,
    perPage: number,
    filter: StudentsResultOverviewFilter
  ) => {
    const {promotionId, status} = filter;
    return usersApi()
      .getStudentsResultOverviewsByStatus(promotionId, status, page, perPage)
      .then((response) => ({
        data: response.data.map(
          (item: StudentResultOverview, index: number) => ({
            ...item,
            id: item.student?.id ?? item.student?.ref ?? index,
          })
        ),
      }));
  },
  getOne: () => {
    throw new Error("not implemented.");
  },
  saveOrUpdate: () => {
    throw new Error("not implemented.");
  },
  delete: () => {
    throw new Error("not implemented.");
  },
};

export default studentsResultOverviewProvider;
