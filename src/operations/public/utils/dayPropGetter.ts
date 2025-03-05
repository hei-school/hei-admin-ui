export const dayPropGetter = (date: Date) => {
  const isSunday = date.getDay() === 0;
  return {
    style: {
      display: isSunday ? "none" : "block",
    },
  };
};
