const CURRENCY = "Ar";

export const renderMoney = (amount: number): string => {
  return amount.toLocaleString() + " " + CURRENCY;
};
