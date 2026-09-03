import {
  FeeCategory,
  FeeCountKey,
  FeeCounts,
  FeeGrade,
  FeeRow,
  FeeStats,
  FeeType,
  LevelType,
} from "../types";

const ALL_GRADES: readonly FeeGrade[] = ["L1", "L2", "L3"];

export const FEE_COUNT_KEYS: readonly FeeCountKey[] = [
  "unpaid",
  "paid",
  "pending",
  "late",
  "total",
];

const NO_COUNTS: FeeCounts = {
  unpaid: 0,
  paid: 0,
  pending: 0,
  late: 0,
  total: 0,
};

type FeeRowGroup = {category: FeeCategory} & (
  | {
      rowsPerGrade: true;
      labelPrefix: string;
      statKeyByGrade: Record<FeeGrade, string>;
    }
  | {rowsPerGrade: false; label: string; statKey: string}
);

const FEE_ROW_GROUPS: readonly FeeRowGroup[] = [
  {
    category: "MONTH",
    rowsPerGrade: true,
    labelPrefix: "Mensuel",
    statKeyByGrade: {
      L1: "first_grade_monthly",
      L2: "second_grade_monthly",
      L3: "third_grade_monthly",
    },
  },
  {
    category: "YEAR",
    rowsPerGrade: true,
    labelPrefix: "Annuel",
    statKeyByGrade: {
      L1: "first_grade_yearly",
      L2: "second_grade_yearly",
      L3: "third_grade_yearly",
    },
  },
  {
    category: "RATTRAPAGE",
    rowsPerGrade: true,
    labelPrefix: "Rattrapages",
    statKeyByGrade: {
      L1: "retakeExam_first_grade_count",
      L2: "retakeExam_second_grade_count",
      L3: "retakeExam_third_grade_count",
    },
  },
  {
    category: "FRAIS_GENERAUX",
    rowsPerGrade: true,
    labelPrefix: "Frais généraux",
    statKeyByGrade: {
      L1: "student_insurance_first_grade_count",
      L2: "student_insurance_second_grade_count",
      L3: "student_insurance_third_grade_count",
    },
  },
  {
    category: "ALTERNANT",
    rowsPerGrade: false,
    label: "Alternants",
    statKey: "work_study",
  },
];

export const buildRows = (
  feeType: FeeType,
  level: LevelType,
  stats: FeeStats | undefined
): FeeRow[] =>
  FEE_ROW_GROUPS.filter((group) => isSelected(group, feeType)).flatMap(
    (group) => buildGroupRows(group, level, stats)
  );

const isSelected = (group: FeeRowGroup, feeType: FeeType): boolean =>
  feeType === "ALL" || feeType === group.category;

const buildGroupRows = (
  group: FeeRowGroup,
  level: LevelType,
  stats: FeeStats | undefined
): FeeRow[] => {
  const {category} = group;

  if (!group.rowsPerGrade) {
    return [
      {
        label: group.label,
        category,
        ...readCounts(stats, group.statKey),
      },
    ];
  }

  return resolveGrades(level).map((grade) => ({
    label: `${group.labelPrefix} ${grade}`,
    category,
    ...readCounts(stats, group.statKeyByGrade[grade]),
  }));
};

const resolveGrades = (level: LevelType): readonly FeeGrade[] =>
  level === "ALL" ? ALL_GRADES : [level];

const readCounts = (
  stats: FeeStats | undefined,
  statKey: string
): FeeCounts => ({
  unpaid: readCount(stats?.unpaid_fees_count, statKey),
  paid: readCount(stats?.paid_fees_count, statKey),
  pending: readCount(stats?.pending_fees_count, statKey),
  late: readCount(stats?.late_fees_count, statKey),
  total: readCount(stats?.total_expected_fees_count, statKey),
});

const readCount = (
  countsByStatKey: object | null | undefined,
  statKey: string
): number => {
  const counts = countsByStatKey as Record<string, number | null> | null;
  return Number(counts?.[statKey] ?? NaN);
};

export const computeTotals = (rows: readonly FeeRow[]): FeeCounts =>
  rows.reduce<FeeCounts>((totals, row) => {
    const summedTotals = {...totals};
    for (const countKey of FEE_COUNT_KEYS) {
      summedTotals[countKey] += orZero(row[countKey]);
    }
    return summedTotals;
  }, NO_COUNTS);

const orZero = (count: number): number => (isNaN(count) ? 0 : count);

export const hasCount = (count: number): boolean => !isNaN(count);

export const toPaidRatio = (paid: number, total: number): number =>
  total > 0 ? (paid / total) * 100 : 0;
