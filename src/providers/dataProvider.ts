import {HaDataProviderType} from "@/providers/HaDataProviderType";
import announcementProvider from "@/providers/announcementProvider";
import commentProvider from "@/providers/commentProvider";
import CourseAssignmentsProvider from "@/providers/courseAssignmentsProvider";
import courseProvider from "@/providers/courseProvider";
import docsProvider from "@/providers/docsProvider";
import eventParticipantProvider from "@/providers/eventParticipantProvider";
import eventProvider from "@/providers/eventProvider";
import examGradeProvider from "@/providers/examGradeProvider";
import examsProvider from "@/providers/examProvider";
import exportEventParticipantProvider from "@/providers/exportEventParticipantProvider";
import exportGroupProvider from "@/providers/exportGroupProvider";
import exportPromotionProvider from "@/providers/exportPromotionProvider";
import exportStudentProvider from "@/providers/exportStudentProvider";
import exportTeacherProvider from "@/providers/exportTeacherProvider";
import feeProvider from "@/providers/feeProvider";
import feesExportProvider from "@/providers/feesExportProvider";
import feesTemplatesProvider from "@/providers/feesTemplatesProvider";
import groupFlowProvider from "@/providers/groupFlowProvider";
import groupProvider from "@/providers/groupProvider";
import groupStudentProvider from "@/providers/groupStudentProvider";
import heiDocsProvider from "@/providers/heiDocsProvider";
import lettersStatsProvider from "@/providers/letterStatsProvider";
import lettersProvider from "@/providers/lettersProvider";
import missingListProvider from "@/providers/missingListProvider";
import monitorProvider from "@/providers/monitorProvider";
import monitorStudentProvider from "@/providers/monitorStudentProvider";
import mpbsVerifyProvider from "@/providers/mpbsVerifyProvider";
import paymentProvider from "@/providers/paymentProvider";
import profilePicProvider from "@/providers/profilePicProvider";
import profileProvider from "@/providers/profileProvider";
import promotionGroupsProvider from "@/providers/promotionGroupsProvider";
import promotionProvider from "@/providers/promotionProvider";
import receiptProvider from "@/providers/receiptProvider";
import staffExportProvider from "@/providers/staffExportProvider";
import staffProvider from "@/providers/staffProvider";
import statsProvider from "@/providers/statsProvider";
import studentProvider from "@/providers/studentProvider";
import teacherProvider from "@/providers/teacherProvider";
import usersLettersProvider from "@/providers/usersLettersProvider";
import {courseAssignmentsByTeacherProvider} from "./courseAssignementbyTeacher";

export const MAX_ITEM_PER_PAGE = 500;

const providerMap = {
  "profile": profileProvider,
  "announcements": announcementProvider,
  "students": studentProvider,
  "students-export": exportStudentProvider,
  "fees": feeProvider,
  "payments": paymentProvider,
  "teachers": teacherProvider,
  "export-teachers": exportTeacherProvider,
  "docs": docsProvider,
  "groups": groupProvider,
  "group-flow": groupFlowProvider,
  "group-students": groupStudentProvider,
  "profile-picture": profilePicProvider,
  "fees-templates": feesTemplatesProvider,
  "comments": commentProvider,
  "promotions": promotionProvider,
  "promotions-groups": promotionGroupsProvider,
  "course": courseProvider,
  "stats": statsProvider,
  "hei-docs": heiDocsProvider,
  "users-letters": usersLettersProvider,
  "letters": lettersProvider,
  "letters-stats": lettersStatsProvider,
  "receipts": receiptProvider,
  "courses-assignements": courseAssignmentsByTeacherProvider,
  "course-assignments": CourseAssignmentsProvider,
  "events": eventProvider,
  "missing-event": missingListProvider,
  "events-participants-export": exportEventParticipantProvider,
  "event-participants": eventParticipantProvider,
  "monitors": monitorProvider,
  "monitor-students": monitorStudentProvider,
  "promotions-export": exportPromotionProvider,
  "group-export": exportGroupProvider,
  "fees-export": feesExportProvider,
  "exams": examsProvider,
  "staffmembers": staffProvider,
  "staffs-export": staffExportProvider,
  "mpbs-verify": mpbsVerifyProvider,
  "exam-grades": examGradeProvider,
} as const;

const getProvider = (
  resourceType: keyof typeof providerMap
): HaDataProviderType => {
  const provider = providerMap[resourceType];
  if (!provider) {
    throw new Error("Unexpected resourceType: " + resourceType);
  }
  return provider;
};

const getHasNextPageInfo = async (
  resource: keyof typeof providerMap,
  page: number,
  perPage: number,
  filter: any,
  meta: any
) => {
  const response = await getProvider(resource).getList(
    page + 1,
    perPage,
    filter,
    meta
  );

  if (!response || !response.data) {
    throw new Error(
      `Provider for resource ${resource} did not return a valid response with a data property.`
    );
  }

  return response.data.length > 0;
};
const dataProvider = {
  async getList(resourceType: keyof typeof providerMap, params: any) {
    const {pagination, meta, filter} = params;

    const page = pagination.page === 0 ? 1 : pagination.page;
    let perPage = pagination.perPage;

    if (perPage > MAX_ITEM_PER_PAGE) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `Page size is too big, truncating to MAX_ITEM_PER_PAGE=${MAX_ITEM_PER_PAGE}: resourceType=${resourceType}, requested pageSize=${perPage}`
        );
      }
      perPage = MAX_ITEM_PER_PAGE;
    }

    const {data} = await getProvider(resourceType).getList(
      page,
      perPage,
      filter,
      meta
    );

    if (!data) {
      throw new Error(
        `Provider for resourceType ${resourceType} did not return a valid data property.`
      );
    }

    const hasNextPage = await getHasNextPageInfo(
      resourceType,
      page,
      perPage,
      filter,
      meta
    );

    return {
      data,
      pageInfo: {
        hasNextPage,
        hasPreviousPage: page > 1,
      },
    };
  },
  async getOne(resourceType: keyof typeof providerMap, params: any) {
    const result = await getProvider(resourceType).getOne(
      params.id,
      params.meta
    );
    return {data: result};
  },
  async update(resourceType: keyof typeof providerMap, params: any) {
    const result = await getProvider(resourceType).saveOrUpdate(
      [params.data].flat(),
      {
        isUpdate: true,
        meta: params.meta ?? {},
      }
    );
    return {data: result[0]};
  },
  async create(resourceType: keyof typeof providerMap, params: any) {
    const result = await getProvider(resourceType).saveOrUpdate(
      resourceType === "students" ||
        resourceType === "teachers" ||
        resourceType === "monitors"
        ? toEnabledUsers([params.data])
        : [params.data],
      params
    );
    return {data: result[0]};
  },
  async delete(resourceType: keyof typeof providerMap, params: any) {
    const result = await getProvider(resourceType).delete(params.id);
    return {data: result};
  },
  deleteMany: () => {
    throw new Error("Not Implemented");
  },
  getMany: () => {
    throw new Error("Not implemented");
  },
  getManyReference: () => {
    throw new Error("Not implemented");
  },
  updateMany: () => {
    throw new Error("Not implemented");
  },
};

const toEnabledUsers = (users: Array<any>): Array<any> => {
  const enabledUsers = [];
  for (const user of users) {
    const enabledUser = Object.assign(user);
    enabledUser.status = "ENABLED";
    enabledUsers.push(enabledUser);
  }
  return enabledUsers;
};

export default dataProvider;
