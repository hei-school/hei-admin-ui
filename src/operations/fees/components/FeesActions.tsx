import feeProvider from "@/providers/feeProvider";
import {CreateButton, ImportButton} from "@/ui/haToolbar";
import {Box} from "@mui/material";
import {
  minimalFeesHeaders,
  optionalFeesHeaders,
  transformFeesData,
  valideFeesData,
} from "../importConf";
import {FeesFilters} from "./FeesFilter";

type FeesActionsProps = {
  studentId: string;
};

const FeesActions = ({studentId}: FeesActionsProps) => {
  return (
    <Box>
      <CreateButton resource={`students/${studentId}/fees`} />
      <ImportButton
        resource="frais"
        provider={feeProvider.saveOrUpdate}
        validateData={valideFeesData}
        optionalHeaders={optionalFeesHeaders}
        minimalHeaders={minimalFeesHeaders}
        transformData={(data: any) => transformFeesData(data, studentId)}
      />
      <FeesFilters />
    </Box>
  );
};

export default FeesActions;
