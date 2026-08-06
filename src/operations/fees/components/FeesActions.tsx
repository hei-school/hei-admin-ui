import feeProvider from "@/providers/feeProvider";
import {ImportButton} from "@/ui/haToolbar";
import {Box} from "lucide-react";
import {CreateButton} from "react-admin";
import {
  minimalFeesHeaders,
  optionalFeesHeaders,
  transformFeesData,
  valideFeesData,
} from "../importConf";
import {FeesFilters} from "./FeesFilter";

const FeesActions = (id: string) => {
  return (
    <Box>
      <CreateButton resource={`students/${id}/fees`} />
      <ImportButton
        resource="frais"
        provider={feeProvider.saveOrUpdate}
        validateData={valideFeesData}
        optionalHeaders={optionalFeesHeaders}
        minimalHeaders={minimalFeesHeaders}
        transformData={(data: any) => transformFeesData(data, id)}
      />
      <FeesFilters />
    </Box>
  );
};

export default FeesActions;
