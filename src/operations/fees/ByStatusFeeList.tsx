import {getMonthFilters} from "@/providers/utils";
import {HaList} from "@/ui/haList/HaList";
import {Fee, FeeStatusEnum} from "@haapi-3d601c85/typescript-client";
import {ReceiptLong} from "@mui/icons-material";
import {Box} from "@mui/material";
import {FunctionField, ShowButton, TextField} from "react-admin";
import {DateField} from "../common/components/fields";
import {renderMoney} from "../common/utils/money";
import {commentFunctionRenderer} from "../utils";
import {FeesListHeader} from "./components";
import {StatusFilterButtons} from "./components/StatusFilterButtons";
import {CATEGORY} from "./constants";
import {rowStyle} from "./utils";

const FEES_LIST_DEFAULT_FILTER = {
  status: FeeStatusEnum.LATE,
  ...getMonthFilters(),
};

const FILTER_SX = {
  display: "flex",
  justifyContent: "center",
  mb: -7,
};

const ByStatusFeeList = () => {
  return (
    <Box>
      <HaList
        title="Liste des frais par statut"
        icon={<ReceiptLong />}
        resource="fees"
        header={
          <>
            <FeesListHeader
              isMpbs={false}
              title="Statistiques des frais filtrés par statut (en retard par défaut)"
            />
            <Box sx={FILTER_SX}>
              <StatusFilterButtons />
            </Box>
          </>
        }
        listProps={{
          filterDefaultValues: FEES_LIST_DEFAULT_FILTER,
          storeKey: "latefees",
        }}
        mainSearch={{label: "Référence étudiant", source: "student_ref"}}
        filterIndicator={true}
        datagridProps={{
          rowClick: (id: string) => `/fees/${id}/show`,
          rowStyle,
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
