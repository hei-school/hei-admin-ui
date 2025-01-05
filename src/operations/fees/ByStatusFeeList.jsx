import {
  Button,
  FunctionField,
  ShowButton,
  TextField,
  useDataProvider,
} from "react-admin";
import {Box} from "@mui/material";
import {Download} from "@mui/icons-material";
import {FeeStatusEnum} from "@haapi/typescript-client";
import {HaList} from "@/ui/haList/HaList";
import {FeesFilters} from "./components/FeesFilter";
import {DateField} from "../common/components/fields";
import {commentFunctionRenderer} from "../utils";
import {renderMoney} from "../common/utils/money";
import {rowStyle} from "./utils";
import {FileDownloader} from "../common/components";

const ByStatusFeeList = () => {
  const dataProvider = useDataProvider();

  const downloadFile = async () => {
    const {
      data: {file},
    } = await dataProvider.getOne("fees-export", {
      id: null,
      meta: {
        status: FeeStatusEnum.LATE,
      },
    });
    return {data: file};
  };

  return (
    <Box>
      <HaList
        title=" "
        resource="fees"
        listProps={{
          filterDefaultValues: {status: FeeStatusEnum.LATE},
          storeKey: "latefees",
        }}
        actions={
          <>
            <FeesFilters />
            <FileDownloader
              downloadFunction={downloadFile}
              fileName="Liste frais en retard"
              buttonText={
                <Button
                  label="Exporter"
                  startIcon={<Download />}
                  sx={{
                    color: "black",
                    opacity: "0.8",
                    padding: "0.5rem 1.1rem",
                    textTransform: "none",
                    gap: "0.8rem",
                  }}
                />
              }
              successMessage="Exportation en cours..."
              errorMessage="Erreur lors de l'exportation du fichier."
              fileType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            />
          </>
        }
        mainSearch={{label: "Référence étudiant", source: "student_ref"}}
        filterIndicator={false}
        datagridProps={{
          rowClick: (id) => `/fees/${id}/show`,
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
          render={(fee) => renderMoney(fee.remaining_amount)}
        />
        <ShowButton basePath="/fees" />
      </HaList>
    </Box>
  );
};

export default ByStatusFeeList;
