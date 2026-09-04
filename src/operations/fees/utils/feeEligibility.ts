import {
  Fee,
  FeeStatusEnum,
  FeeTypeEnum,
} from "@haapi-b0fc7615/typescript-client";

export const isCatchUpFee = (fee: Fee): boolean =>
  fee.type === FeeTypeEnum.RETAKE_EXAM_COSTS;

const dueTime = (fee: Fee): number =>
  fee.due_datetime
    ? new Date(fee.due_datetime).getTime()
    : Number.POSITIVE_INFINITY;

export const payableUnpaidFees = <T extends Fee>(fees: T[]): T[] => {
  const unpaid = fees.filter((fee) => fee.status !== FeeStatusEnum.PAID);
  const catchUpFees = unpaid.filter(isCatchUpFee);
  const [earliestNormalFee] = unpaid
    .filter((fee) => !isCatchUpFee(fee))
    .sort((a, b) => dueTime(a) - dueTime(b));
  return earliestNormalFee ? [earliestNormalFee, ...catchUpFees] : catchUpFees;
};
