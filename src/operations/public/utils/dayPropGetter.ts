export const dayPropGetter = (date: Date) => {
  const isSunday = date.getDay() === 0;
  return {
    style: {
      display: isSunday ? "none" : "block",
    },
  };
};

if (typeof window !== "undefined") {
  (window as any).dayPropGetter = dayPropGetter;
}
