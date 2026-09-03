import {useRole} from "@/security/hooks";
import {ArchiveStatusEnum, Fee} from "@haapi-b0fc7615/typescript-client";
import {useGetList} from "react-admin";

export type FeeRecord = Fee & {id: string};

/**
 * Single source of truth for the fees pending archiving / rejected: fetches
 * the fee list once (role-gated) and splits it by archive status. Shared by
 * the dashboard summary card and the full archiving list so they don't each
 * fire their own request and re-implement the same filtering.
 */
export const useFeesToArchive = () => {
  const role = useRole();
  const isAllowed = role.isManager() || role.isAdmin();
  const {
    data: fees,
    isLoading,
    refetch,
  } = useGetList<FeeRecord>(
    "fees",
    {pagination: {page: 1, perPage: 500}},
    {enabled: isAllowed}
  );

  const toArchiveFees =
    fees?.filter(
      (fee) => fee.archive_status === ArchiveStatusEnum.TO_ARCHIVE
    ) ?? [];
  const rejectedFees =
    fees?.filter((fee) => fee.archive_status === ArchiveStatusEnum.REJECTED) ??
    [];

  return {isAllowed, isLoading, toArchiveFees, rejectedFees, refetch};
};
