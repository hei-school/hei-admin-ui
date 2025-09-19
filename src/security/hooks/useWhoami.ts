import authProvider from "@/providers/authProvider";

export const useWhoami = () => authProvider.getCachedWhoami();
