import {complaintApi} from "@/providers/api";
import {
  HaDataProviderType,
  HaMeta,
  notImplemented,
} from "@/providers/HaDataProviderType";
import {
  ComplaintRouting,
  ComplaintType,
} from "@haapi-3d601c85/typescript-client";

interface ComplaintRoutingFilter {
  complaintType?: ComplaintType;
  // getComplaintRoutings has no manager filter param, so it's applied client-side
  managerId?: string;
}

interface CrupdateComplaintRoutingPayload {
  type: ComplaintType;
  manager_id: string;
}

const complaintRoutingProvider: HaDataProviderType<
  ComplaintRouting,
  ComplaintRoutingFilter,
  HaMeta,
  [CrupdateComplaintRoutingPayload]
> = {
  getList: async (page, perPage, filter) => {
    const {complaintType, managerId} = filter;
    return complaintApi()
      .getComplaintRoutings(
        page,
        perPage,
        complaintType ? [complaintType] : undefined
      )
      .then((response) => ({
        data: managerId
          ? response.data.filter((routing) => routing.manager?.id === managerId)
          : response.data,
      }));
  },
  // there is no routing id to look up: the "id" here is the complaint type itself
  getOne: async (type: string) => {
    return complaintApi()
      .getLastComplaintRouting(type as ComplaintType)
      .then((response) => ({...response.data, id: type}))
      .catch(() => ({type: type as ComplaintType, id: type}));
  },
  saveOrUpdate: async ([payload]) => {
    return complaintApi()
      .createComplaintRouting(payload)
      .then((response) => [response.data]);
  },
  delete: notImplemented,
};

export default complaintRoutingProvider;
