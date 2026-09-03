import {FeeCountKey} from "../types";
import {FEE_STATUS_COLORS} from "./StyleFeeStat";

type StatusColors = {value: string; header: string};

export type FeeCountColumn = {
  key: FeeCountKey;
  label: string;
  statusColors?: StatusColors;
};

type FeeStatusColumn = FeeCountColumn & {statusColors: StatusColors};

export const FEE_COUNT_COLUMNS: readonly FeeCountColumn[] = [
  {key: "unpaid", label: "Non payés", statusColors: FEE_STATUS_COLORS.unpaid},
  {key: "paid", label: "Payés", statusColors: FEE_STATUS_COLORS.paid},
  {key: "pending", label: "En cours", statusColors: FEE_STATUS_COLORS.pending},
  {key: "late", label: "Retard", statusColors: FEE_STATUS_COLORS.late},
  {key: "total", label: "Total"},
];

export const FEE_LEGEND_ITEMS: readonly FeeStatusColumn[] =
  FEE_COUNT_COLUMNS.filter(
    (column): column is FeeStatusColumn => column.statusColors !== undefined
  );

export const MISSING_COUNT_LABEL = "—";
