import {FeeStatusEnum} from "@haapi-3d601c85/typescript-client";
import {Typography} from "@mui/material";
import {useListContext} from "react-admin";
import {useFeesTotalForStatus} from "../utils/useFeesTotalForStatus";

export const FeeListTotal = () => {
  const {filterValues} = useListContext();
  const status: FeeStatusEnum = filterValues?.status ?? FeeStatusEnum.LATE;
  const total = useFeesTotalForStatus(
    filterValues?.listDateFrom,
    filterValues?.listDateTo,
    status
  );

  if (total === undefined) return null;

  return (
    <Typography variant="body2" fontWeight={700} whiteSpace="nowrap">
      Total : {total}
    </Typography>
  );
};
