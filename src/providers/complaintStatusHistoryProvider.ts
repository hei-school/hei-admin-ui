import {complaintApi} from "@/providers/api";
import {
  HaDataProviderType,
  notImplemented,
} from "@/providers/HaDataProviderType";
import {ComplaintStatusHistory} from "@haapi-3d601c85/typescript-client";

interface ComplaintStatusHistoryFilter {
  complaintId?: string;
  from?: Date;
  to?: Date;
}

// the API doesn't give status history entries an id, but react-admin's Datagrid needs one
type IdentifiedComplaintStatusHistory = ComplaintStatusHistory & {id: string};

const complaintStatusHistoryProvider: HaDataProviderType<
  IdentifiedComplaintStatusHistory,
  ComplaintStatusHistoryFilter
> = {
  getList: async (page, perPage, filter) => {
    const {complaintId, from, to} = filter;
    if (!complaintId) return {data: []};
    return complaintApi()
      .getComplaintStatusHistory(complaintId, page, perPage, from, to)
      .then((response) => ({
        data: response.data.map((history, index) => ({
          ...history,
          id: `${complaintId}-${index}`,
        })),
      }));
  },
  getOne: notImplemented,
  saveOrUpdate: notImplemented,
  delete: notImplemented,
};

export default complaintStatusHistoryProvider;
