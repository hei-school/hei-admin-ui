import { paymentTypes } from '../../conf'
import { CreatePaymentTypeEnum } from '../../gen/haClient'

export const paymentTypeRenderer = type => {
  console.log(paymentTypes.find(element => element.id === type))
  return paymentTypes.find(element => element.id.toString() === type)
}
