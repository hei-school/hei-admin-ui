import {MobileMoneyType} from "@haapi/typescript-client";
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
import {rowStyle, PSP_COLORS, PSP_VALUES} from "./utils";
import {PSP_ICON} from "./components/pspIcon";

const ListForm = () => {
  const notify = useNotify();

  return (
    <RowForm
      mutationMode="pessimistic"
      mutationOptions={{
        onError: () => {
          notify("Une erreur s'est produite", {
            type: "error",
          });
        },
      }}
    >
      <DateField source="due_datetime" label="Date limite" showTime={false} />
      <FunctionField
        source="comment"
        render={commentFunctionRenderer}
        label="Commentaire"
      />
      <FunctionField
        label="Reste à payer"
        render={(record) => renderMoney(record.remaining_amount)}
      />
      <DateField
        source="creation_datetime"
        label="Date de création"
        showTime={false}
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
      {record.mpbs ? ( // Change this when api is ready
        <Tooltip title="En cours de vérification">
          <IconButton variant="contained" color="info">
            {PSP_ICON["SUCCESS"]}
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Payer avec Mobile Money">
          <IconButton onClick={open} variant="contained">
            <AddMbpsIcon />
          </IconButton>
        </Tooltip>
      )}
      <Link to={`/fees/${record?.id}/show`}>
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
      editable={true}
      editForm={<ListForm />}
      filterIndicator={false}
      datagridActions={<EditableDatagridActions />}
      listProps={{
        filterDefaultValues: {studentId},
      }}
      datagridProps={{
        rowStyle,
      }}
    >
      <DateField source="due_datetime" label="Date limite" showTime={false} />
      <FunctionField
        source="comment"
        render={commentFunctionRenderer}
        label="Commentaire"
      />
      <FunctionField
        label="Reste à payer"
        render={(record) => renderMoney(record.remaining_amount)}
      />
      <DateField
        source="creation_datetime"
        label="Date de création"
        showTime={false}
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
      actions={<FeesActions studentId={studentId} />}
      filterIndicator={false}
      listProps={{
        filterDefaultValues: {studentId},
      }}
      datagridProps={{
        rowClick: (id) => `/fees/${id}/show`,
        rowStyle,
      }}
      editable={false}
    >
      <DateField source="due_datetime" label="Date limite" showTime={false} />
      <FunctionField
        source="comment"
        render={commentFunctionRenderer}
        label="Commentaire"
      />
      <FunctionField
        label="Reste à payer"
        render={(record) => renderMoney(record.remaining_amount)}
      />
      <DateField
        source="creation_datetime"
        label="Date de création"
        showTime={false}
      />
      <TextField
        source="psp_id"
        label="Référence de la transaction"
        emptyText={EMPTY_TEXT}
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
    <>
      <CreateButton resource={`students/${studentId}/fees`} />
      <ImportButton
        resource="frais"
        provider={feeProvider.saveOrUpdate}
        validateData={valideFeesData}
        optionalHeaders={optionalFeesHeaders}
        minimalHeaders={minimalFeesHeaders}
        transformData={(data) => transformFeesData(data, studentId)}
      />
    </>
  );
}

const FeeList = () => {
  const {isStudent} = useRole();

  return isStudent() ? <StudentFeeList /> : <ManagerFeeList />;
};

export default FeeList;
