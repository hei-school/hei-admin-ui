export const useFeesOnly = (): boolean => {
  return (import.meta as any).env.VITE_FEES_ONLY === "true";
};