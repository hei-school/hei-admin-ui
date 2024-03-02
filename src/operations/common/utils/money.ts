const CURRENCY: string = "Ar";

export const renderPrettyMoney = (amount: number): string => {
  return amount.toLocaleString() + " " + CURRENCY;
};
