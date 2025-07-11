import {getMonthFilters} from "@/providers/utils";
import {HaList} from "@/ui/haList/HaList";
import {Fee, FeeStatusEnum} from "@haapi/typescript-client";
import {Download} from "@mui/icons-material";
import {Box} from "@mui/material";
import {useState} from "react";
import {Button, FunctionField, ShowButton, TextField} from "react-admin";
import {DateField} from "../common/components/fields";
import {renderMoney} from "../common/utils/money";
import {commentFunctionRenderer} from "../utils";
import {FeesListHeader} from "./components";
import {FeesFilters} from "./components/FeesFilter";
import {CATEGORY} from "./constants";
import {rowStyle} from "./utils";
import {FeesExport} from "./utils/FeesExport";

const FEES_LIST_DEFAULT_FILTER = {
  status: FeeStatusEnum.LATE,
  ...getMonthFilters(),
};

const ByStatusFeeList = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  return (
    <Box>
      <HaList
        title=" "
        icon={""}
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
        actions={
          <>
            <FeesFilters />
            <Button
              startIcon={<Download />}
              onClick={handleOpenDialog}
              label="Exporter"
              sx={{
                color: "black",
                opacity: "0.8",
                padding: "0.5rem 1.1rem",
                textTransform: "none",
                gap: "0.8rem",
                width: "100%",
                justifyContent: "flex-start",
              }}
            />
            {openDialog && (
              <FeesExport open={openDialog} onClose={handleCloseDialog} />
            )}
          </>
        }
        mainSearch={{label: "Référence étudiant", source: "student_ref"}}
        filterIndicator={true}
        datagridProps={{
          rowClick: (id: any) => `/fees/${id}/show`,
          rowStyle,
        }}
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
          render={(record: any) => {
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
