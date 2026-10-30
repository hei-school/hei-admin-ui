import {complaintApi} from "@/providers/api";
import {
  HaDataProviderType,
  HaMeta,
  notImplemented,
} from "@/providers/HaDataProviderType";
import {
  Complaint,
  ComplaintStatus,
  ComplaintType,
} from "@haapi-3d601c85/typescript-client";

interface ComplaintFilter {
  from?: Date;
  to?: Date;
  complaintType?: ComplaintType;
  complaintStatus?: ComplaintStatus;
  managerId?: string;
  assigneeId?: string;
}

interface ComplaintStatusPayload {
  id: string;
  status: ComplaintStatus;
  comment?: string;
}

interface ComplaintAssigneesPayload {
  id: string;
  user_ids: string[];
}

interface ComplaintMeta extends HaMeta {
  method: "STATUS" | "ASSIGNEES";
}

type ComplaintPayload = [ComplaintStatusPayload | ComplaintAssigneesPayload];

const isAssigneesPayload = (
  _payload: ComplaintPayload[number],
  method: ComplaintMeta["method"]
): _payload is ComplaintAssigneesPayload => method === "ASSIGNEES";

const complaintProvider: HaDataProviderType<
  Complaint,
  ComplaintFilter,
  ComplaintMeta,
  ComplaintPayload
> = {
  getList: async (page, perPage, filter) => {
    const {from, to, complaintType, complaintStatus, managerId, assigneeId} =
      filter;
    return complaintApi()
      .getComplaints(
        page,
        perPage,
        from,
        to,
        complaintType ? [complaintType] : undefined,
        complaintStatus ? [complaintStatus] : undefined,
        managerId,
        assigneeId
      )
      .then((response) => ({data: response.data}));
  },
  getOne: async (id: string) => {
    return complaintApi()
      .getComplaintById(id)
      .then((response) => response.data);
  },
  saveOrUpdate: async ([payload], {meta}: {meta: ComplaintMeta}) => {
    if (isAssigneesPayload(payload, meta.method)) {
      return complaintApi()
        .addComplaintAssignees(payload.id, {user_ids: payload.user_ids})
        .then((response) => [response.data]);
    }
    return complaintApi()
      .updateComplaintStatus(payload.id, {
        status: payload.status,
        comment: payload.comment,
      })
      .then((response) => [response.data]);
  },
  delete: notImplemented,
};

export default complaintProvider;
