import {FeeStats} from "../types";

const COUNT_FIELDS = [
  "total_expected_fees_count",
  "paid_fees_count",
  "pending_fees_count",
  "late_fees_count",
] as const;

export const isGeneratingStats = (stats?: FeeStats): boolean =>
  stats?.expired === true &&
  COUNT_FIELDS.every((field) => stats[field] === null);
