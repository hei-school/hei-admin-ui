import {MobileMoneyType, MpbsStatus} from "@haapi/typescript-client";
import {
  AddCard as AddMbpsIcon,
  CheckCircle,
  Visibility as ShowIcon,
  WarningOutlined,
  Pending,
} from "@mui/icons-material";
import {Box, IconButton, Tooltip, Chip} from "@mui/material";
import {RowForm, useRowContext} from "@react-admin/ra-editable-datagrid";
import {
  ChipField,
  FunctionField,
  Link,
  SelectInput,
  TextField,
  TextInput,
  required,
  useRecordContext,
} from "react-admin";
import {
  EditableDatagrid,
  EditRowButton,
} from "@react-admin/ra-editable-datagrid";
import {useNotify} from "@/hooks";
import {useStudentRef} from "@/hooks/useStudentRef";
import feeProvider, {toApiIds} from "@/providers/feeProvider";
import {useRole} from "@/security/hooks/useRole";
import {EMPTY_TEXT} from "@/ui/constants";
import {HaList} from "@/ui/haList/HaList";
import {CreateButton, ImportButton} from "@/ui/haToolbar";
import {DeleteWithConfirm} from "../common/components";
import {DateField} from "../common/components/fields";
import {renderMoney} from "../common/utils/money";
import {commentFunctionRenderer} from "../utils";
import {
  minimalFeesHeaders,
  optionalFeesHeaders,
  transformFeesData,
  valideFeesData,
} from "./importConf";
import {rowStyle, PSP_COLORS, PSP_VALUES, StatusIcon} from "./utils";
import {FeesFilter} from "./components/FeesFilter";

export const MPBS_STATUS_LABEL = {
  SUCCESS: "Paiement avec succès",
  FAILED: "Paiement échoué",
  PENDING: "Vérification en cours",
};

const ListForm = () => {
  const notify = useNotify();

  return (
    <RowForm
      mutationOptions={{
        onError: () => {
          notify("Une erreur s'est produite", {
            type: "error",
          });
        },
      }}
    >
      <DateField
        source="due_datetime"
        label="Limite de paiement du frais"
        showTime={false}
      />
      <FunctionField
        label="Reste à payer"
        render={(record) => renderMoney(record.remaining_amount)}
      />
      <FunctionField
        source="comment"
        render={commentFunctionRenderer}
        label="Commentaire"
      />
      <DateField
        source="mpbs.creation_datetime"
        label="Ajout de la référence de transaction"
        showTime
      />
      <DateField
        source="mpbs.last_datetime_verification"
        label="Dernière vérification par HEI"
        showTime
      />
      <DateField
        source="mpbs.psp_own_datetime_verification"
        label="Vérification par Orange"
        showTime
      />
      <DateField
        source="mpbs.successfully_verified_on"
        label="Vérification réussie"
        showTime
      />
      <TextInput source="psp_id" label="Référence de la transaction" />
      <SelectInput
        source="psp_type"
        label="Type de transaction"
        choices={[{id: MobileMoneyType.ORANGE_MONEY, name: "Orange"}]}
        defaultValue={MobileMoneyType.ORANGE_MONEY}
      />
    </RowForm>
  );
};

export const EditableDatagridActions = () => {
  const {open} = useRowContext();
  const record = useRecordContext();

  return (
    <Box display="flex" justifyContent="space-evenly" boxSizing="border-box">
      {record.mpbs ? (
        <StatusIcon />
      ) : (
        <Tooltip
          title="Payer avec Mobile Money"
          data-testid={`addMobileMoney-${record.id}`}
        >
          <IconButton onClick={open} variant="contained">
            <AddMbpsIcon />
          </IconButton>
        </Tooltip>
      )}
      <Link
        to={`/fees/${record?.id}/show`}
        data-testid={`showButton-${record.id}`}
      >
        <Tooltip title="Afficher">
          <IconButton variant="contained">
            <ShowIcon />
          </IconButton>
        </Tooltip>
      </Link>
    </Box>
  );
};

const StudentFeeList = () => {
  const {studentRef, studentId} = useStudentRef("studentId");

  return (
    <HaList
      icon={<WarningOutlined />}
      title={`Frais de ${studentRef}`}
      resource={"fees"}
      filterIndicator={false}
      hasDatagrid={false}
      listProps={{
        filterDefaultValues: {studentId},
      }}
    >
      <EditableDatagrid
        editForm={<ListForm />}
        bulkActionButtons={false}
        noDelete
        actions={<EditableDatagridActions />}
        rowSx={rowStyle}
      >
        <DateField
          source="due_datetime"
          label="Limite de paiement du frais"
          showTime={false}
        />
        <FunctionField
          label="Reste à payer"
          render={(record) => renderMoney(record.remaining_amount)}
        />
        <FunctionField
          source="comment"
          render={commentFunctionRenderer}
          label="Commentaire"
        />
        <DateField
          source="mpbs.creation_datetime"
          label="Ajout de la référence de transaction"
          showTime
        />
        <DateField
          source="mpbs.last_datetime_verification"
          label="Dernière vérification par HEI"
          showTime
        />
        <DateField
          source="mpbs.psp_own_datetime_verification"
          label="Vérification par Orange"
          showTime
        />
        <DateField
          source="mpbs.successfully_verified_on"
          label="Vérification réussie"
          showTime
        />
        <TextField
          source="mpbs.psp_id"
          label="Référence de la transaction"
          emptyText={EMPTY_TEXT}
        />
        <FunctionField
          render={(fee) =>
            fee.mpbs ? (
              <Chip
                color={PSP_COLORS[fee.mpbs?.psp_type]}
                label={PSP_VALUES[fee.mpbs?.psp_type]}
              />
            ) : (
              EMPTY_TEXT
            )
          }
          label="Type de transaction"
          emptyText={EMPTY_TEXT}
        />
      </EditableDatagrid>
    </HaList>
  );
};

const ManagerFeeList = () => {
  const {studentRef, studentId} = useStudentRef("studentId");

  return (
    <HaList
      icon={<WarningOutlined />}
      title={`Frais de ${studentRef}`}
      resource={"fees"}
      filterIndicator={false}
      actions={<FeesActions studentId={studentId} />}
      listProps={{
        filterDefaultValues: {studentId},
        storeKey: "fees",
      }}
      datagridProps={{
        rowClick: (id) => `/fees/${id}/show`,
        rowStyle,
      }}
      editable={false}
    >
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
        label="Reste à payer"
        render={(record) => renderMoney(record.remaining_amount)}
      />
      <TextField
        source="mpbs.psp_id"
        label="Référence de la transaction"
        emptyText={EMPTY_TEXT}
      />
      <FunctionField
        render={(fee) =>
          fee.mpbs ? (
            <Chip
              color={PSP_COLORS[fee.mpbs?.psp_type]}
              label={PSP_VALUES[fee.mpbs?.psp_type]}
            />
          ) : (
            EMPTY_TEXT
          )
        }
        label="Type de transaction"
        emptyText={EMPTY_TEXT}
      />
      <DateField
        source="mpbs.creation_datetime"
        label="Ajout de la référence de transaction"
        showTime
      />
      <DateField
        source="mpbs.last_datetime_verification"
        label="Dernière vérification par HEI"
        showTime
      />
      <DateField
        source="mpbs.psp_own_datetime_verification"
        label="Vérification par Orange"
        showTime
      />
      <DateField
        source="mpbs.successfully_verified_on"
        label="Vérification réussie"
        showTime
      />
      <DeleteWithConfirm
        resourceType="fees"
        redirect={`/students/${studentId}/fees`}
        confirmTitle="Suppression de frais"
        confirmContent="Confirmez-vous la suppression de ce frais ?"
      />
    </HaList>
  );
};

function FeesActions({studentId}) {
  return (
    <Box>
      <CreateButton resource={`students/${studentId}/fees`} />
      <ImportButton
        resource="frais"
        provider={feeProvider.saveOrUpdate}
        validateData={valideFeesData}
        optionalHeaders={optionalFeesHeaders}
        minimalHeaders={minimalFeesHeaders}
        transformData={(data) => transformFeesData(data, studentId)}
      />
      <FeesFilter />
    </Box>
  );
}

const FeeList = () => {
  const {isStudent} = useRole();

  return isStudent() ? <StudentFeeList /> : <ManagerFeeList />;
};

export default FeeList;
