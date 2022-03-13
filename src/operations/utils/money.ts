const currency: string = 'Ar'

export const prettyPrintMoney = (amount: number): string => {
  return amount.toLocaleString() + ' ' + currency
}
