import {MobileMoneyType, MpbsStatus} from "@haapi/typescript-client";
import {
  AutocompleteArrayInput,
  ChipField,
  FunctionField,
  FormDataConsumer,
  Link,
  SelectArrayInput,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput,
  required,
  useCreateContext,
  useCreateController,
  useGetList,
  useRecordContext,
  useRecordSelection,
} from "react-admin";
import {
  EditableDatagrid,
  EditRowButton,
} from "@react-admin/ra-editable-datagrid";
import {
  AddCard as AddMbpsIcon,
  CheckCircle,
  Visibility as ShowIcon,
  WarningOutlined,
  Pending,
  Money,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  Tooltip,
  Chip,
  TextField as MuiTextInput,
  Typography,
} from "@mui/material";
import {RowForm, useRowContext} from "@react-admin/ra-editable-datagrid";
import {useNotify, useToggle} from "@/hooks";
import {useStudentRef} from "@/hooks/useStudentRef";
import feeProvider, {toApiIds} from "@/providers/feeProvider";
import {useRole} from "@/security/hooks/useRole";
import {EMPTY_TEXT} from "@/ui/constants";
import {Dialog} from "@/ui/components";
import {HaList} from "@/ui/haList/HaList";
import {
  ButtonBase,
  CreateButton,
  HaActionWrapper,
  ImportButton,
} from "@/ui/haToolbar";
import {Create, DeleteWithConfirm} from "@/operations/common/components";
import {DateField} from "@/operations/common/components/fields";
import {SelectGroup} from "@/operations/announcements/components";
import {FeesFilter} from "@/operations/fees/components/FeesFilter";
import {renderMoney} from "@/operations/common/utils/money";
import {commentFunctionRenderer} from "@/operations/utils";
import {
  minimalFeesHeaders,
  optionalFeesHeaders,
  transformFeesData,
  valideFeesData,
} from "@/operations/fees/importConf";
import {
  rowStyle,
  PSP_COLORS,
  PSP_VALUES,
  StatusIcon,
  DEFAULT_REMEDIAL_COSTS_AMOUNT,
  DEFAULT_REMEDIAL_COSTS_DUE_DATETIME,
} from "@/operations/fees/utils";
import {formatDate, toUTC} from "@/utils/date";
import authProvider from "@/providers/authProvider";

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

const EditableDatagridActions = () => {
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

const DefaultInfos = () => {
  return (
    <FormDataConsumer>
      {({formData, ...rest}) => {
        const {course_list = []} = formData;

        return (
          <Box width="100%">
            <MuiTextInput
              label="Montant total"
              value={DEFAULT_REMEDIAL_COSTS_AMOUNT * course_list.length}
              size="small"
              margin="normal"
              disabled
              fullWidth
            />
            <MuiTextInput
              label="Nombre de frais à créer"
              value={course_list.length}
              size="small"
              margin="normal"
              disabled
              fullWidth
            />
          </Box>
        );
      }}
    </FormDataConsumer>
  );
};

const CatchupFeesCreate = () => {
  const {data: courses} = useGetList("course", {pagination: {perPage: 50}});
  const {id: student_id} = authProvider.getCachedWhoami();

  return (
    <Create
      resource="fees"
      title=" "
      redirect={false}
      mutationOptions={{
        onSuccess: () => {
          notify("Frais créés avec succès");
          toggle();
        },
      }}
      transform={(data) => {
        return data?.course_list.map((course) => ({
          type: "REMEDIAL_COSTS",
          comment: `Rattrapage ${course}`,
          total_amount: DEFAULT_REMEDIAL_COSTS_AMOUNT,
          student_id,
          due_datetime: DEFAULT_REMEDIAL_COSTS_DUE_DATETIME,
          creation_datetime: toUTC(new Date()),
        }));
      }}
    >
      <SimpleForm>
        <SelectArrayInput
          source="course_list"
          label="UE à rattraper"
          choices={courses}
          optionValue="code"
          optionText="code"
          fullWidth
        />
        <DefaultInfos />
        <Typography variant="caption" color="red">
          *PS: La date limite de paiement est le{" "}
          {formatDate(DEFAULT_REMEDIAL_COSTS_DUE_DATETIME, false)}
        </Typography>
      </SimpleForm>
    </Create>
  );
};

export const StudentFeeList = () => {
  const {studentRef, studentId} = useStudentRef("studentId");
  const [show, _set, toggle] = useToggle();

  return (
    <Box>
      <HaList
        icon={<WarningOutlined />}
        title={`Frais de ${studentRef}`}
        resource={"fees"}
        filterIndicator={false}
        hasDatagrid={false}
        listProps={{
          filterDefaultValues: {studentId},
        }}
        actions={
          <Box>
            <HaActionWrapper>
              <ButtonBase
                icon={<Money />}
                label="Frais rattrapage"
                onClick={toggle}
              />
            </HaActionWrapper>
          </Box>
        }
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
      <Dialog
        title="Créer mon/mes frais de rattrapage"
        open={show}
        onClose={toggle}
      >
        <CatchupFeesCreate />
      </Dialog>
    </Box>
  );
};
