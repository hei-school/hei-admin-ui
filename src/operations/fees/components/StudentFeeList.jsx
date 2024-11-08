import {useMemo} from "react";
import {
  FeeStatusEnum,
  FeeTypeEnum,
  LetterStatus,
  MobileMoneyType,
  MpbsStatus,
} from "@haapi/typescript-client";
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
  useRefresh,
  useListContext,
  regex,
  minLength,
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
import {Box, Chip, TextField as MuiTextInput, Typography} from "@mui/material";
import {RowForm, useRowContext} from "@react-admin/ra-editable-datagrid";
import {useNotify, useToggle} from "@/hooks";
import {useStudentRef} from "@/hooks/useStudentRef";
import {EMPTY_TEXT} from "@/ui/constants";
import {HaList} from "@/ui/haList/HaList";
import {ButtonBase, HaActionWrapper} from "@/ui/haToolbar";
import {Create} from "@/operations/common/components";
import {StudentFeeCreate} from "@/operations/fees/StudentFeeCreate";
import {CreateLettersDialog} from "@/operations/letters/CreateLetters";
import {DateField} from "@/operations/common/components/fields";
import {renderMoney} from "@/operations/common/utils/money";
import {
  commentFunctionRenderer,
  IconButtonWithTooltip,
} from "@/operations/utils";
import {
  rowStyle,
  PSP_COLORS,
  PSP_VALUES,
  MpbsStatusIcon,
  DEFAULT_REMEDIAL_COSTS_AMOUNT,
  DEFAULT_REMEDIAL_COSTS_DUE_DATETIME,
} from "@/operations/fees/utils";
import {formatDate, toUTC} from "@/utils/date";
import {PALETTE_COLORS} from "@/haTheme";
import {FeesDialog} from "./FeesDialog";
import {LetterStatusIcon} from "./letterIcon";
import authProvider from "@/providers/authProvider";

const TRANSACTION_PATTERN =
  /^MP[a-zA-Z0-9]{6}\.[a-zA-Z0-9]{4}\.[a-zA-Z0-9]{6}$/;

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
  const {id} = useRecordContext();
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
        onError: (error) => {
          if (error.response?.status === 500) {
            notify("Cette référence de transaction existe déjà", {
              type: "error",
            });
          } else if (error.response?.status === 404) {
            notify("Transaction non trouvée chez Orange", {
              type: "error",
            });
          } else {
            notify("Une erreur inattendue s'est produite", {
              type: "error",
            });
          }
        },
      }}
      transform={(data) => ({...data, student_id, id})}
    >
      <SimpleForm>
        <TextInput
          source="psp_id"
          label="Référence de la transaction"
          validate={[
            minLength(
              20,
              "La référence doit contenir exactement 20 caractères"
            ),
            regex(
              TRANSACTION_PATTERN,
              "La référence n'est pas saisie correctement (ex : MP123456.1234.B12345)"
            ),
          ]}
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

const ListActionButtons = ({studentId}) => {
  const {id, total_amount, mpbs, letter, status, due_datetime, student_id} =
    useRecordContext();
  const {data: fees = []} = useGetList("fees", {
    pagination: {page: 1, perPage: 100},
    filter: {studentId: student_id},
  });
  const refresh = useRefresh();
  const [show3, , toggle3] = useToggle();
  const [show4, , toggle4] = useToggle();

  const prevUnpaidFee = useMemo(() => {
    return fees.find((fee) => {
      const feeDueDate = new Date(fee.due_datetime);
      const targetDueDate = new Date(due_datetime);

      return (
        feeDueDate < targetDueDate &&
        fee.status !== FeeStatusEnum.PAID &&
        !fee.comment?.includes("Rattrapage")
      );
    });
  }, [fees, due_datetime]);

  return (
    <Box>
      {mpbs && mpbs.status !== MpbsStatus.FAILED ? (
        <MpbsStatusIcon />
      ) : (
        <IconButtonWithTooltip
          title="Mobile Money"
          disabled={
            (letter && letter.status !== LetterStatus.REJECTED) ||
            status === FeeStatusEnum.PAID ||
            !!prevUnpaidFee
          }
        >
          <AddMbpsIcon onClick={toggle3} data-testid={`addMobileMoney-${id}`} />
        </IconButtonWithTooltip>
      )}
      {letter && letter.status !== LetterStatus.REJECTED ? (
        <LetterStatusIcon />
      ) : (
        <IconButtonWithTooltip
          title="Bordereau"
          disabled={
            (mpbs && mpbs.status !== MpbsStatus.FAILED) ||
            status === FeeStatusEnum.PAID ||
            !!prevUnpaidFee
          }
        >
          <SlipIcon onClick={toggle4} data-testid={`addPaymentSlip-${id}`} />
        </IconButtonWithTooltip>
      )}
      <Link to={`/fees/${id}/show`} data-testid={`showButton-${id}`}>
        <IconButtonWithTooltip title="Afficher">
          <ShowIcon />
        </IconButtonWithTooltip>
      </Link>
      <FeesDialog
        title="Paiement de mon frais par Mobile Money"
        show={show3}
        toggle={toggle3}
      >
        <MpbsCreate toggle={toggle3} />
      </FeesDialog>
      <CreateLettersDialog
        isOpen={show4}
        onClose={() => {
          toggle4();
          refresh();
        }}
        studentId={studentId}
        feeAmount={total_amount}
        feeId={id}
        title="Payer mon frais par ajout d'un bordereau"
      />
    </Box>
  );
};

export const StudentFeeList = () => {
  const {studentRef, studentId} = useStudentRef("studentId");
  const [show, _set, toggle] = useToggle();
  const [show2, _set2, toggle2] = useToggle();

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
        <ListActionButtons studentId={studentId} />
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
    </Box>
  );
};
