import {useState} from "react";
import {Button, FunctionField, ShowButton, TextField} from "react-admin";
import {Box} from "@mui/material";
import {Download} from "@mui/icons-material";
import {Fee, FeeStatusEnum} from "@haapi/typescript-client";
import {HaList} from "@/ui/haList/HaList";
import {FeesFilters} from "./components/FeesFilter";
import {DateField} from "../common/components/fields";
import {commentFunctionRenderer} from "../utils";
import {renderMoney} from "../common/utils/money";
import {rowStyle} from "./utils";
import {FeesListHeader} from "./components";
import {FeesExport} from "./utils/FeesExport";

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
          filterDefaultValues: {status: FeeStatusEnum.LATE},
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
        filterIndicator={false}
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
          label="Reste à payer"
          render={(fee: Fee) => renderMoney(fee.remaining_amount!)}
        />
        <ShowButton href="/fees" />
      </HaList>
    </Box>
  );
};

export default ByStatusFeeList;
