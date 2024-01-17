import { mainTheme } from "../../../haTheme";

export const rowStyle = (record, _index) => {
  const lateColor = record.status === "LATE" ? "#f57c73" : "inherit";
  return {
    backgroundColor:
      record.status === "PAID" ? mainTheme.palette.grey[300] : lateColor,
  };
};
