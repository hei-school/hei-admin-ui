import {AdvancedFeesStatistics} from "@haapi/typescript-client";

export type FeeStats = AdvancedFeesStatistics & {
  id: string;
  expired: boolean;
  update_datetime: Date;
};
