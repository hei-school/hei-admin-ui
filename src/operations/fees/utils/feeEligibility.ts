import {
  Fee,
  FeeStatusEnum,
  FeeTypeEnum,
} from "@haapi-3d601c85/typescript-client";

export const isCatchUpFee = (fee: Fee): boolean =>
  fee.type === FeeTypeEnum.RETAKE_EXAM_COSTS;

export const payableUnpaidFees = <T extends Fee>(fees: T[]): T[] => {
  const unpaid = fees.filter((fee) => fee.status !== FeeStatusEnum.PAID);
  const catchUpFees = unpaid.filter(isCatchUpFee);
  const [earliestNormalFee] = unpaid
    .filter((fee) => !isCatchUpFee(fee))
    .sort(
      (a, b) =>
        new Date(a.due_datetime ?? 0).getTime() -
        new Date(b.due_datetime ?? 0).getTime()
    );
  return earliestNormalFee ? [earliestNormalFee, ...catchUpFees] : catchUpFees;
};
