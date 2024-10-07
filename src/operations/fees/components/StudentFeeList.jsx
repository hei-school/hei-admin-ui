import {FeeTypeEnum, MobileMoneyType} from "@haapi/typescript-client";
import {
  FunctionField,
  FormDataConsumer,
  Link,
  SelectArrayInput,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput,
  useGetList,
  useRecordContext,
} from "react-admin";
import {EditableDatagrid} from "@react-admin/ra-editable-datagrid";
import {
  AddCard as AddMbpsIcon,
  Visibility as ShowIcon,
  WarningOutlined,
  FilePresent as SlipIcon,
  Repartition,
  Paid,
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
import {StudentFeeCreate} from "@/operations/fees/StudentFeeCreate";
import {CreateLettersDialog} from "@/operations/letters/CreateLetters";
import {Create} from "@/operations/common/components";
import {DateField} from "@/operations/common/components/fields";
import {useNotify, useToggle} from "@/hooks";
import {useStudentRef} from "@/hooks/useStudentRef";
import {EMPTY_TEXT} from "@/ui/constants";
import {HaList} from "@/ui/haList/HaList";
import {ButtonBase, HaActionWrapper} from "@/ui/haToolbar";
import {renderMoney} from "@/operations/common/utils/money";
import {commentFunctionRenderer} from "@/operations/utils";
import {
  rowStyle,
  PSP_COLORS,
  PSP_VALUES,
  StatusIcon,
  DEFAULT_REMEDIAL_COSTS_AMOUNT,
  DEFAULT_REMEDIAL_COSTS_DUE_DATETIME,
} from "@/operations/fees/utils";
import {formatDate, toUTC} from "@/utils/date";
import {PALETTE_COLORS} from "@/haTheme";
import {FeesDialog} from "./FeesDialog";
import authProvider from "@/providers/authProvider";

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

const CatchupFeesCreate = ({toggle}) => {
  const notify = useNotify();
  const {data: courses} = useGetList("course", {pagination: {perPage: 50}});
  const {id: student_id} = authProvider.getCachedWhoami();

  return (
    <Create
      resource="fees"
      title=" "
      redirect={false}
      mutationOptions={{
        onSuccess: () => {
          notify("Frais créés avec succès", {type: "success"});
          toggle();
        },
      }}
      transform={(data) => {
        return data?.course_list.map((course) => ({
          type: FeeTypeEnum.REMEDIAL_COSTS,
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

const MpbsCreate = ({toggle}) => {
  const notify = useNotify();
  // TODO : add fee id in transform
  const {id: student_id} = authProvider.getCachedWhoami();

  return (
    <Create
      resource="fees"
      title=" "
      redirect={false}
      mutationOptions={{
        onSuccess: () => {
          notify("Frais créés avec succès", {type: "success"});
          toggle();
        },
      }}
      transform={(data) => ({...data, student_id})}
    >
      <SimpleForm>
        <TextInput
          source="psp_id"
          label="Référence de la transaction"
          fullWidth
        />
        <SelectInput
          source="psp_type"
          label="Type de transaction"
          defaultValue={MobileMoneyType.ORANGE_MONEY}
          choices={[{id: MobileMoneyType.ORANGE_MONEY, name: "Orange"}]}
          fullWidth
        />
      </SimpleForm>
    </Create>
  );
};
export const StudentFeeList = () => {
  const {studentRef, studentId} = useStudentRef("studentId");
  const [show, _set, toggle] = useToggle();
  const [show2, _set2, toggle2] = useToggle();
  const [show3, , toggle3] = useToggle();
  const [show4, , toggle4] = useToggle();

  return (
    <Box>
      <HaList
        icon={<WarningOutlined />}
        title={`Frais de ${studentRef}`}
        resource={"fees"}
        filterIndicator={false}
        listProps={{
          filterDefaultValues: {studentId},
        }}
        datagridProps={{
          rowClick: false,
        }}
        actions={
          <Box>
            <HaActionWrapper>
              <ButtonBase
                icon={
                  <Repartition
                    sx={{
                      color: PALETTE_COLORS.primary,
                    }}
                  />
                }
                label="Frais rattrapage"
                onClick={toggle}
              />
              <ButtonBase
                icon={
                  <Paid
                    sx={{
                      color: PALETTE_COLORS.primary,
                    }}
                  />
                }
                label="Écolages"
                onClick={toggle2}
                data-testid="fees-create-button"
              />
            </HaActionWrapper>
          </Box>
        }
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
        {/* <DateField
          source="mpbs.creation_datetime"
          label="Ajout de la référence de transaction"
          showTime
        /> */}
        <DateField
          source="mpbs.last_datetime_verification"
          label="Dernière vérification par HEI"
          showTime
        />
        <DateField
          source="mpbs.psp_own_datetime_verification"
          label="Vérification par PSP"
          showTime
        />
        <DateField
          source="mpbs.successfully_verified_on"
          label="Vérification réussie"
          showTime
        />
        {/* <TextField
          source="mpbs.psp_id"
          label="Référence de la transaction"
          emptyText={EMPTY_TEXT}
        /> */}
        {/* <FunctionField
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
        /> */}
        <IconButton>
          <AddMbpsIcon onClick={toggle3} />
        </IconButton>
        <IconButton>
          <SlipIcon onClick={toggle4} />
        </IconButton>
        <IconButton>
          <ShowIcon />
        </IconButton>
      </HaList>
      <FeesDialog
        title="Créer mon/mes frais de rattrapage"
        children={<CatchupFeesCreate toggle={toggle} />}
        show={show}
        toggle={toggle}
      />
      <FeesDialog
        title="Création de frais"
        children={<StudentFeeCreate toggle={toggle2} />}
        show={show2}
        toggle={toggle2}
      />
      <FeesDialog
        title="Paiement de mon frais par Mobile Money"
        show={show3}
        toggle={toggle3}
      >
        <MpbsCreate toggle={toggle3} />
      </FeesDialog>
      <CreateLettersDialog
        isOpen={show4}
        onClose={toggle4}
        studentId={studentId}
        feeAmount={0}
        feeId="ID"
        title="Payer mon frais par ajout d'un bordereau"
      />
    </Box>
  );
};
