export const useFeesOnly = () => {
  return process.env.REACT_APP_FEES_ONLY === "true";
};
