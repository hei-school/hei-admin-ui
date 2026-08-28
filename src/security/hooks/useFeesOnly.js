import authProvider from "@/providers/authProvider";

export const useFeesOnly = () => {
  const envFeesOnly = process.env.REACT_APP_FEES_ONLY === "true";
  const whoami = authProvider.getCachedWhoami();
  const userFeesOnly = whoami?.feesOnly === true;

  return envFeesOnly || userFeesOnly;
};
