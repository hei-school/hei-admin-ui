import {
  manualFeeTypes,
  predefinedFeeTypes,
  predefinedFirstDueDates,
} from "../../conf";
import {commentRenderer, toUTC} from "../utils";

const toDate = (str) => {
  const parts = str.split("-");
  return new Date(parts[0], parts[1] - 1 /* note(js-months) */, parts[2]);
};

export const createFees = (
  fees,
  feesConf,
  payload,
  isPredefinedType,
  createFeesConf
) => {
  const {firstDate, isPredefinedDueDate} = createFeesConf;
  const firstDueDate = payload.is_predefined_first_dueDate
    ? predefinedFirstDueDates[payload.predefined_first_dueDate].value
    : toDate(payload.manual_first_duedate);

  let feeType = isPredefinedType
    ? predefinedFeeTypes[payload.predefined_type][0].type
    : manualFeeTypes[payload.manual_type]?.type;
  const isLastDay =
    isPredefinedDueDate && payload.predefined_first_dueDate === "date3";
  const currentDate = new Date(firstDate.year, firstDate.month, 1);
  const createDueDatetime = (index) => {
    if (isLastDay) {
      const result = toUTC(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      ).toISOString();
      currentDate.setMonth(currentDate.getMonth() + 1);
      return result;
    }
    return toUTC(
      new Date(
        firstDueDate.getFullYear(),
        firstDueDate.getMonth() + index,
        firstDueDate.getDate()
      )
    ).toISOString();
  };

  if (feesConf.length <= 1) {
    for (let i = 0; i < payload.months_number; i++) {
      fees.push({
        total_amount: payload.monthly_amount,
        type: feeType,
        due_datetime: createDueDatetime(i),
        comment: commentRenderer(payload.comment, payload.months_number, i),
      });
    }
  } else {
    for (let j = 0; j < feesConf.length; j++) {
      let totalMonthsNumber = feesConf.reduce(
        (acc, currentValue) => acc + currentValue.monthsNumber,
        0
      );
      let start =
        j === 0
          ? 0
          : totalMonthsNumber -
            (totalMonthsNumber - feesConf[j - 1].monthsNumber);
      let end = start + feesConf[j].monthsNumber;

      for (let i = start; i < end; i++) {
        fees.push({
          total_amount: feesConf[j].monthlyAmount,
          type: feeType,
          due_datetime: createDueDatetime(i),
          comment: commentRenderer(payload.comment, totalMonthsNumber, i),
        });
      }
    }
  }
};
