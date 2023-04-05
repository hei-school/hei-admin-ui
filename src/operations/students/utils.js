import { manualFeeTypes, predefinedFeeTypes, predefinedFirstDueDates } from '../../conf'
import { commentRenderer } from '../utils'

const toDate = str => {
  const parts = str.split('-')
  return new Date(parts[0], parts[1] - 1 /* note(js-months) */, parts[2])
}

export const createFees = (fees, feesConf, payload, isPredefinedType) => {
  const firstDueDate = payload.is_predefined_first_dueDate
    ? predefinedFirstDueDates[payload.predefined_first_dueDate].value
    : toDate(payload.manual_first_duedate)

  let feeType = isPredefinedType ? predefinedFeeTypes[payload.predefined_type][0].type : manualFeeTypes[payload.manual_type]?.type
  if (feesConf.length <= 1) {
    for (let i = 0; i < payload.months_number; i++) {
      let dueDate = new Date(firstDueDate.getFullYear(), firstDueDate.getMonth() + i, firstDueDate.getDate()).toISOString()
      fees.push({
        total_amount: payload.monthly_amount,
        type: feeType,
        due_datetime: dueDate,
        comment: commentRenderer(payload.comment, payload.months_number, i)
      })
    }
  } else {
    for (let j = 0; j < feesConf.length; j++) {
      let totalMonthsNumber = feesConf.reduce((acc, currentValue) => acc + currentValue.monthsNumber, 0)
      let start = j === 0 ? 0 : totalMonthsNumber - (totalMonthsNumber - feesConf[j - 1].monthsNumber)
      let end = start + feesConf[j].monthsNumber

      for (let i = start; i < end; i++) {
        let dueDate = new Date(firstDueDate.getFullYear(), firstDueDate.getMonth() + i, firstDueDate.getDate()).toISOString()
        fees.push({
          total_amount: feesConf[j].monthlyAmount,
          type: feeType,
          due_datetime: dueDate,
          comment: commentRenderer(payload.comment, totalMonthsNumber, i)
        })
      }
    }
  }
}
