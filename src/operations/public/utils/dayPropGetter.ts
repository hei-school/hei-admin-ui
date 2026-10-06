export const dayPropGetter = (date: Date) => {
  const isSunday = date.getDay() === 0;
  return {
    style: {
      display: isSunday ? "none" : "block",
    },
  };
};

declare global {
  interface Window {
    dayPropGetter?: typeof dayPropGetter;
  }
}

if (typeof window !== "undefined") {
  window.dayPropGetter = dayPropGetter;
}
