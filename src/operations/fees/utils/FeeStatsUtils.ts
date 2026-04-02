import {FeeRow, FeeStats, FeeType, LevelType, RowTotals} from "../types";

export const toMonthInput = (iso: unknown): string => {
  if (!iso) return "";
  const str = typeof iso === "string" ? iso : String(iso);
  return str.slice(0, 7);
};

export const buildDateRange = (
  tempFrom: string,
  tempTo: string
): {monthFrom: string; monthTo: string} => {
  const fromDate = new Date(`${tempFrom}-01T00:00:00.000Z`);
  const [toYear, toMonth] = tempTo.split("-").map(Number);
  const lastDay = new Date(Date.UTC(toYear, toMonth, -1));
  lastDay.setUTCHours(23, 59, 59, 999);
  return {monthFrom: fromDate.toISOString(), monthTo: lastDay.toISOString()};
};

export const isAlternantOrRattrapage = (feeType: FeeType): boolean =>
  feeType === "ALTERNANT" || feeType === "RATTRAPAGE";

const FEE_MONTHLY_GRADE_KEY_MAP: Record<"L1" | "L2" | "L3", string> = {
  L1: "first_grade_monthly",
  L2: "second_grade_monthly",
  L3: "third_grade_monthly",
};

const FEE_YEARLY_GRADE_KEY_MAP: Record<"L1" | "L2" | "L3", string> = {
  L1: "first_grade_yearly",
  L2: "second_grade_yearly",
  L3: "third_grade_yearly",
};

const RETAKE_GRADE_KEY_MAP: Record<"L1" | "L2" | "L3", string> = {
  L1: "retakeExam_first_grade_count",
  L2: "retakeExam_second_grade_count",
  L3: "retakeExam_third_grade_count",
};

type StatObj = Record<string, number | null | undefined>;

const getStat = (statObj: object | null | undefined, key: string): number =>
  Number((statObj as StatObj | null | undefined)?.[key] ?? NaN);

export const buildRows = (
  feeType: FeeType,
  level: LevelType,
  stats: FeeStats | undefined
): FeeRow[] => {
  const rows: FeeRow[] = [];

  const grades: Array<"L1" | "L2" | "L3"> =
    level === "ALL" || isAlternantOrRattrapage(feeType)
      ? ["L1", "L2", "L3"]
      : [level as "L1" | "L2" | "L3"];

  if (feeType === "ALL" || feeType === "MONTH") {
    for (const grade of grades) {
      const gradeKey = FEE_MONTHLY_GRADE_KEY_MAP[grade];
      rows.push({
        label: `Mensuel ${grade}`,
        type: "MONTH",
        grade,
        unpaid: getStat(stats?.unpaid_fees_count, gradeKey),
        paid: getStat(stats?.paid_fees_count, gradeKey),
        pending: getStat(stats?.pending_fees_count, gradeKey),
        late: getStat(stats?.late_fees_count, gradeKey),
        total: getStat(stats?.total_expected_fees_count, gradeKey),
      });
    }
  }

  if (feeType === "ALL" || feeType === "YEAR") {
    for (const grade of grades) {
      const gradeKey = FEE_YEARLY_GRADE_KEY_MAP[grade];
      rows.push({
        label: `Annuel ${grade}`,
        type: "YEAR",
        grade,
        unpaid: getStat(stats?.unpaid_fees_count, gradeKey),
        paid: getStat(stats?.paid_fees_count, gradeKey),
        pending: getStat(stats?.pending_fees_count, gradeKey),
        late: getStat(stats?.late_fees_count, gradeKey),
        total: getStat(stats?.total_expected_fees_count, gradeKey),
      });
    }
  }

  if (feeType === "RATTRAPAGE" || feeType === "ALL") {
    const retakeGrades: Array<"L1" | "L2" | "L3"> =
      level === "ALL" ? ["L1", "L2", "L3"] : [level as "L1" | "L2" | "L3"];

    for (const grade of retakeGrades) {
      const retakeKey = RETAKE_GRADE_KEY_MAP[grade];
      rows.push({
        label: `Rattrapages ${grade}`,
        type: "MONTH",
        grade: "R",
        dotColor: "#e07b7b",
        unpaid: getStat(stats?.unpaid_fees_count, retakeKey),
        paid: getStat(stats?.paid_fees_count, retakeKey),
        pending: getStat(stats?.pending_fees_count, retakeKey),
        late: getStat(stats?.late_fees_count, retakeKey),
        total: getStat(stats?.total_expected_fees_count, retakeKey),
      });
    }
  }

  if (feeType === "ALTERNANT" || feeType === "ALL") {
    rows.push({
      label: "Alternants",
      type: "MONTH",
      grade: "A",
      dotColor: "#a78bfa",
      unpaid: getStat(stats?.unpaid_fees_count, "work_study"),
      paid: getStat(stats?.paid_fees_count, "work_study"),
      pending: getStat(stats?.pending_fees_count, "work_study"),
      late: getStat(stats?.late_fees_count, "work_study"),
      total: getStat(stats?.total_expected_fees_count, "work_study"),
    });
  }

  return rows;
};

export const computeTotals = (rows: FeeRow[]): RowTotals =>
  rows.reduce(
    (acc, r) => ({
      unpaid: acc.unpaid + (isNaN(r.unpaid) ? 0 : r.unpaid),
      paid: acc.paid + (isNaN(r.paid) ? 0 : r.paid),
      pending: acc.pending + (isNaN(r.pending) ? 0 : r.pending),
      late: acc.late + (isNaN(r.late) ? 0 : r.late),
      total: acc.total + (isNaN(r.total) ? 0 : r.total),
    }),
    {unpaid: 0, paid: 0, pending: 0, late: 0, total: 0}
  );

export const getBarColor = (pct: number): string =>
  pct >= 75 ? "#6fcf97" : pct >= 40 ? "#f1C16B" : "#e07b7b";
