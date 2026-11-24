import {getMonthFilters} from "@/providers/utils";
import {HaList} from "@/ui/haList/HaList";
import {Fee, FeeStatusEnum} from "@haapi-3d601c85/typescript-client";
import {ReceiptLong} from "@mui/icons-material";
import {Box} from "@mui/material";
import {FunctionField, Identifier, ShowButton, TextField} from "react-admin";
import {DateField} from "../common/components/fields";
import {renderMoney} from "../common/utils/money";
import {commentFunctionRenderer} from "../utils";
import {FeesListHeader} from "./components";
import {FeeListFilterButton} from "./components/FeeListFilterButton";
import {FeeListTotal} from "./components/FeeListTotal";
import {CATEGORY} from "./constants";
import {getFeeRowStyle} from "./utils";
import {getDefaultListDateRange} from "./utils/FeeListDateRange";

const LIST_DATE_RANGE = getDefaultListDateRange();

const FEES_LIST_DEFAULT_FILTER = {
  status: FeeStatusEnum.LATE,
  ...getMonthFilters(),
  listDateFrom: LIST_DATE_RANGE.listDateFrom,
  listDateTo: LIST_DATE_RANGE.listDateTo,
};

const ByStatusFeeList = () => {
  return (
    <Box>
      <HaList
        title="Liste des frais par statut"
        icon={<ReceiptLong />}
        resource="fees"
        header={
          <FeesListHeader
            isMpbs={false}
            title="Statistiques des frais filtrés par statut (en retard par défaut)"
          />
        }
        listProps={{
          filterDefaultValues: FEES_LIST_DEFAULT_FILTER,
          storeKey: "latefees",
        }}
        mainSearch={{label: "Référence étudiant", source: "student_ref"}}
        beforeSearch={<FeeListTotal />}
        directActions={<FeeListFilterButton />}
        filterIndicator={true}
        datagridProps={{
          rowClick: (id: Identifier) => `/fees/${id}/show`,
          rowStyle: getFeeRowStyle,
        }}
        actions={undefined}
      >
        <TextField source="student_ref" label="Référence de l'étudiant" />
        <TextField source="student_first_name" label="Prénom de l'étudiant" />
        <DateField source="due_datetime" label="Date limite" showTime={false} />
        <FunctionField
          source="comment"
          render={commentFunctionRenderer}
          label="Commentaire"
        />
        <FunctionField
          source="category"
          label="Catégorie"
          render={(record) => {
            const cat = CATEGORY.find((c) => c.value === record.category);
            return cat ? cat.label : record.category;
          }}
        />
        <FunctionField
          label="Reste à payer"
          render={(fee: Fee) => renderMoney(fee.remaining_amount!)}
        />
        <ShowButton href="/fees" />
      </HaList>
    </Box>
  );
};

export default ByStatusFeeList;
