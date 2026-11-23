import {NOOP_ID} from "@/utils/constants";
import {FeesStatistics, FeeStatusEnum} from "@haapi-3d601c85/typescript-client";
import {useMemo} from "react";
import {useGetOne} from "react-admin";

// La statistique "pending_transaction" est la seule donnée par l'API
// correspondant aux frais de statut PENDING ("En cours").
const STATUS_STATS_FIELD: Record<FeeStatusEnum, keyof FeesStatistics> = {
  [FeeStatusEnum.LATE]: "late_fees",
  [FeeStatusEnum.PENDING]: "pending_transaction",
  [FeeStatusEnum.PAID]: "paid_fees",
  [FeeStatusEnum.UNPAID]: "unpaid_fees",
};

export const useFeesTotalForStatus = (
  listDateFrom?: Date | string,
  listDateTo?: Date | string,
  status?: FeeStatusEnum
): number | undefined => {
  const filters = useMemo(
    () => ({monthFrom: listDateFrom, monthTo: listDateTo}),
    [listDateFrom, listDateTo]
  );

  const {data} = useGetOne<FeesStatistics & {id: string}>(
    "stats",
    {id: NOOP_ID, meta: {resource: "fees", filters}},
    {enabled: Boolean(listDateFrom && listDateTo)}
  );

  if (!data || !status) return undefined;
  return data[STATUS_STATS_FIELD[status]] as number | undefined;
};
