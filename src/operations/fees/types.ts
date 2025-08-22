import {AdvancedFeesStatistics} from "@haapi-b0fc7615/typescript-client";

export type FeeStats = AdvancedFeesStatistics & {
  id: string;
  expired: boolean;
  update_datetime: Date;
};
