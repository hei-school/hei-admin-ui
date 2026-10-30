import {complaintApi} from "@/providers/api";
import authProvider from "@/providers/authProvider";
import {
  HaDataProviderType,
  notImplemented,
} from "@/providers/HaDataProviderType";
import {
  Complaint,
  ComplaintStatus,
  ComplaintType,
  CrupdateComplaint,
} from "@haapi-3d601c85/typescript-client";

interface StudentComplaintFilter {
  status?: ComplaintStatus;
  type?: ComplaintType;
}

// getStudentComplaints has no status/type filter param, so it's applied client-side
const matchesFilter = (complaint: Complaint, filter: StudentComplaintFilter) =>
  (!filter.status || complaint.status === filter.status) &&
  (!filter.type || complaint.type === filter.type);

const studentComplaintProvider: HaDataProviderType<
  Complaint,
  StudentComplaintFilter,
  Record<string, never>,
  [CrupdateComplaint]
> = {
  getList: async (page, perPage, filter = {}) => {
    const studentId = authProvider.getCachedWhoami()?.id ?? "";
    return complaintApi()
      .getStudentComplaints(studentId, page, perPage)
      .then((response) => ({
        data: response.data.filter((complaint) =>
          matchesFilter(complaint, filter)
        ),
      }));
  },
  getOne: async (id: string) => {
    return complaintApi()
      .getComplaintById(id)
      .then((response) => response.data);
  },
  saveOrUpdate: async ([crupdateComplaint]) => {
    return complaintApi()
      .createComplaint(crupdateComplaint)
      .then((response) => [response.data]);
  },
  delete: notImplemented,
};

export default studentComplaintProvider;
