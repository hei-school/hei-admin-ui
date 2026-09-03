import {useRole} from "@/security/hooks";
import {ArchiveStatusEnum, Fee} from "@haapi-b0fc7615/typescript-client";
import {useGetList} from "react-admin";

export type FeeRecord = Fee & {id: string};

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
