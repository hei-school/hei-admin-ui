import {HaDataProviderType} from "@/providers/HaDataProviderType";
import announcementProvider from "@/providers/announcementProvider";
import awardedCoursesProvider from "@/providers/awardedCoursesProvider";
import commentProvider from "@/providers/commentProvider";
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
import {DataProvider} from "react-admin";
import missingListProvider from "./missingListProvider";

export const MAX_ITEM_PER_PAGE = 500;

const getProvider = (resourceType: string): HaDataProviderType => {
  switch (resourceType) {
    case "profile":
      return profileProvider;
    case "announcements":
      return announcementProvider;
    case "students":
      return studentProvider;
    case "students-export":
      return exportStudentProvider;
    case "fees":
      return feeProvider;
    case "payments":
      return paymentProvider;
    case "teachers":
      return teacherProvider;
    case "export-teachers":
      return exportTeacherProvider;
    case "docs":
      return docsProvider;
    case "groups":
      return groupProvider;
    case "group-flow":
      return groupFlowProvider;
    case "group-students":
      return groupStudentProvider;
    case "profile-picture":
      return profilePicProvider;
    case "fees-templates":
      return feesTemplatesProvider;
    case "comments":
      return commentProvider;
    case "promotions":
      return promotionProvider;
    case "promotions-groups":
      return promotionGroupsProvider;
    case "course":
      return courseProvider;
    case "stats":
      return statsProvider;
    case "hei-docs":
      return heiDocsProvider;
    case "users-letters":
      return usersLettersProvider;
    case "letters":
      return lettersProvider;
    case "letters-stats":
      return lettersStatsProvider;
    case "receipts":
      return receiptProvider;
    case "awarded-courses":
      return awardedCoursesProvider;
    case "events":
      return eventProvider;
    case "missing-event":
      return missingListProvider;
    case "events-participants-export":
      return exportEventParticipantProvider;
    case "event-participants":
      return eventParticipantProvider;
    case "monitors":
      return monitorProvider;
    case "monitor-students":
      return monitorStudentProvider;
    case "promotions-export":
      return exportPromotionProvider;
    case "group-export":
      return exportGroupProvider;
    case "fees-export":
      return feesExportProvider;
    case "exams":
      return examsProvider;
    case "staffmembers":
      return staffProvider;
    case "staffs-export":
      return staffExportProvider;
    case "mpbs-verify":
      return mpbsVerifyProvider;
    case "exam-grades":
      return examGradeProvider;
    default:
      throw new Error("Unexpected resourceType: " + resourceType);
  }
};

const getHasNextPageInfo = async (
  resource: string,
  page: number,
  perPage: number,
  filter: any,
  meta: any
) => {
  const {data: nextPageResult} = await getProvider(resource).getList(
    page + 1,
    perPage,
    filter,
    meta
  );

  return nextPageResult.length > 0;
};
const dataProvider: DataProvider = {
  async getList(resourceType: string, params: any) {
    const {pagination, meta, filter} = params;

    const page = pagination.page === 0 ? 1 : pagination.page;
    let perPage = pagination.perPage;

    if (perPage > MAX_ITEM_PER_PAGE) {
      console.warn(
        `Page size is too big, truncating to MAX_ITEM_PER_PAGE=${MAX_ITEM_PER_PAGE}: resourceType=${resourceType}, requested pageSize=${perPage}`
      );
      perPage = MAX_ITEM_PER_PAGE;
    }

    const {data} = await getProvider(resourceType).getList(
      page,
      perPage,
      filter,
      meta
    );

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
  async getOne(resourceType: string, params: any) {
    const result = await getProvider(resourceType).getOne(
      params.id,
      params.meta
    );
    return {data: result};
  },
  async update(resourceType: string, params: any) {
    const result = await getProvider(resourceType).saveOrUpdate(
      [params.data].flat(),
      {
        isUpdate: true,
        meta: params.meta || {},
      }
    );
    return {data: result[0]};
  },
  async create(resourceType: string, params) {
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
  async delete(resourceType: string, params: any) {
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
