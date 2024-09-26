import {HaDataProviderType} from "@/providers/HaDataProviderType";
import {
  RaDataProviderType,
  RaListResponseType,
} from "@/providers/RaDataProviderType";
import profileProvider from "@/providers/profileProvider";
import studentProvider from "@/providers/studentProvider";
import feeProvider from "@/providers/feeProvider";
import paymentProvider from "@/providers/paymentProvider";
import teacherProvider from "@/providers/teacherProvider";
import groupProvider from "@/providers/groupProvider";
import groupFlowProvider from "@/providers/groupFlowProvider";
import groupStudentProvider from "@/providers/groupStudentProvider";
import profilePicProvider from "@/providers/profilePicProvider";
import feesTemplatesProvider from "@/providers/feesTemplatesProvider";
import docsProvider from "@/providers/docsProvider";
import commentProvider from "@/providers/commentProvider";
import promotionProvider from "@/providers/promotionProvider";
import promotionGroupsProvider from "@/providers/promotionGroupsProvider";
import announcementProvider from "@/providers/announcementProvider";
import courseProvider from "@/providers/courseProvider";
import statsProvider from "@/providers/statsProvider";
import heiDocsProvider from "@/providers/heiDocsProvider";
import studentLettersProvider from "@/providers/studentLettersProvider";
import lettersProvider from "@/providers/lettersProvider";
import lettersStatsProvider from "./letterStatsProvider";
import receiptProvider from "./receiptProvider";
export const MAX_ITEM_PER_PAGE = 500;

const getProvider = (resourceType: string): HaDataProviderType => {
  if (resourceType === "profile") return profileProvider;
  if (resourceType === "announcements") return announcementProvider;
  if (resourceType === "students") return studentProvider;
  if (resourceType === "fees") return feeProvider;
  if (resourceType === "payments") return paymentProvider;
  if (resourceType === "teachers") return teacherProvider;
  if (resourceType === "docs") return docsProvider;
  if (resourceType === "groups") return groupProvider;
  if (resourceType === "group-flow") return groupFlowProvider;
  if (resourceType === "group-students") return groupStudentProvider;
  if (resourceType === "profile-picture") return profilePicProvider;
  if (resourceType === "fees-templates") return feesTemplatesProvider;
  if (resourceType === "comments") return commentProvider;
  if (resourceType === "promotions") return promotionProvider;
  if (resourceType === "promotions-groups") return promotionGroupsProvider;
  if (resourceType === "course") return courseProvider;
  if (resourceType === "stats") return statsProvider;
  if (resourceType === "hei-docs") return heiDocsProvider;
  if (resourceType === "student-letters") return studentLettersProvider;
  if (resourceType === "letters") return lettersProvider;
  if (resourceType === "letters-stats") return lettersStatsProvider;
  if (resourceType === "receipts") return receiptProvider;
  throw new Error("Unexpected resourceType: " + resourceType);
};

const dataProvider: RaDataProviderType = {
  async getList(resourceType: string, params: any) {
    let {pagination, meta, filter} = params;

    const page =
      pagination.page === 0 ? 1 /* TODO(empty-pages) */ : pagination.page;
    let perPage = pagination.perPage;

    if (perPage > MAX_ITEM_PER_PAGE) {
      console.warn(
        `Page size is too big, truncating to MAX_ITEM_PER_PAGE=${MAX_ITEM_PER_PAGE}: resourceType=${resourceType}, requested pageSize=${perPage}`
      );
      perPage = MAX_ITEM_PER_PAGE;
    }

    const {data, metadata} = await getProvider(resourceType).getList(
      page,
      perPage,
      filter,
      meta
    );

    return {
      data,
      total: Number.MAX_SAFE_INTEGER,
      metadata,
    } as RaListResponseType;
  },
  async getOne(resourceType: string, params: any) {
    const result = await getProvider(resourceType).getOne(
      params.id,
      params.meta
    );
    return {data: result};
  },
  async update(resourceType: string, params: any) {
    const result = await getProvider(resourceType).saveOrUpdate([params.data], {
      isUpdate: true,
      meta: params.meta || {},
    });
    return {data: result[0]};
  },
  async create(resourceType: string, params = {}) {
    const result = await getProvider(resourceType).saveOrUpdate(
      resourceType === "students" || resourceType === "teachers"
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
};

const toEnabledUsers = (users: Array<any>): Array<any> => {
  let enabledUsers = [];
  for (const user of users) {
    let enabledUser = Object.assign(user);
    enabledUser.status = "ENABLED";
    enabledUsers.push(enabledUser);
  }
  return enabledUsers;
};

export default dataProvider;
