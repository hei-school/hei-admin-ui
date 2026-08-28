import {DateField} from "@/operations/common/components/fields";
import {renderMoney} from "@/operations/common/utils/money";
import {FeeArchiveActions} from "@/operations/fees/components/FeeArchiveActions";
import {CATEGORY} from "@/operations/fees/constants";
import {rowStyle} from "@/operations/fees/utils";
import {commentFunctionRenderer} from "@/operations/utils";
import {EMPTY_TEXT} from "@/ui/constants";
import {HaList} from "@/ui/haList/HaList";
import {ArchiveStatusEnum, Fee} from "@haapi-3d601c85/typescript-client";
import ArchiveIcon from "@mui/icons-material/Archive";
import {Box} from "@mui/material";
import {FunctionField, TextField} from "react-admin";

const FeeArchiveValidationList = () => {
  return (
    <Box>
      <HaList
        title="Archivages de frais à valider"
        icon={<ArchiveIcon />}
        actions={null}
        resource="fees"
        emptyListMessage="Aucun archivage de frais en attente de validation."
        filterIndicator={false}
        mainSearch={{label: "Référence étudiant", source: "student_ref"}}
        listProps={{
          filter: {archive_status: ArchiveStatusEnum.TO_ARCHIVE},
          storeKey: "fees-archive-validations",
        }}
        datagridProps={{
          rowClick: (id: string) => `/fees/${id}/show`,
          rowStyle,
        }}
      >
        <TextField source="student_ref" label="Référence de l'étudiant" />
        <TextField source="student_first_name" label="Prénom de l'étudiant" />
        <DateField
          source="due_datetime"
          label="Limite de paiement du frais"
          showTime={false}
        />
        <FunctionField
          source="comment"
          render={commentFunctionRenderer}
          label="Commentaire"
        />
        <FunctionField
          source="category"
          label="Catégorie"
          render={(record: Fee) => {
            const cat = CATEGORY.find((c) => c.value === record.category);
            return cat ? cat.label : record.category;
          }}
        />
        <FunctionField
          label="Reste à payer"
          render={(fee: Fee) => renderMoney(fee.remaining_amount!)}
        />
        <FunctionField
          label="Demandé par"
          render={(fee: Fee) =>
            fee.archived_by_ref
              ? `${fee.archived_by_first_name ?? ""} ${fee.archived_by_last_name ?? ""} (${fee.archived_by_ref})`.trim()
              : EMPTY_TEXT
          }
        />
        <FunctionField
          label="Validation"
          render={(fee: Fee) => (
            <FeeArchiveActions studentId={fee.student_id!} />
          )}
        />
      </HaList>
    </Box>
  );
};

export default FeeArchiveValidationList;
