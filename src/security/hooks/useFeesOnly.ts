export const useFeesOnly = (): boolean => {
  return process.env.REACT_APP_FEES_ONLY === "true";
};
