import {Fee} from "@haapi-b0fc7615/typescript-client";
import {mainTheme} from "../../../haTheme";

// /!\ TODO: TO function name
export const rowStyle = (record: Pick<Fee, "status">) => {
  const lateColor = record.status === "LATE" ? "#f57c73" : "inherit";
  return {
    backgroundColor:
      record.status === "PAID" ? mainTheme.palette.grey[300] : lateColor,
  };
};

// /!\ TODO: FEE_SIZES
export const FEE_SELECT_STYLE = {
  width: {
    xs: 75,
    sm: 175,
    md: 250,
    lg: 300,
    xl: 325,
  },
};
