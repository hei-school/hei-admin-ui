import {FC, useMemo} from "react";
import {
  Course,
  Fee,
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
  TextInput,
  useGetList,
  useRecordContext,
  useRefresh,
  regex,
  minLength,
} from "react-admin";
import {AxiosError} from "axios";
import {
  AddCard as AddMbpsIcon,
  Payment as PayIcon,
  Visibility as ShowIcon,
  WarningOutlined,
} from "@mui/icons-material";
import {Box, TextField as MuiTextInput, Typography} from "@mui/material";
import {useNotify, useToggle} from "@/hooks";
import {PALETTE_COLORS} from "@/haTheme";
import {useStudentRef} from "@/hooks/useStudentRef";
import {HaList} from "@/ui/haList/HaList";
import {ButtonBase, HaActionWrapper} from "@/ui/haToolbar";
import {Create} from "@/operations/common/components";
import {CreateLettersDialog} from "@/operations/letters/CreateLetters";
import {DateField} from "@/operations/common/components/fields";
import {renderMoney} from "@/operations/common/utils/money";
import {
  commentFunctionRenderer,
  IconButtonWithTooltip,
} from "@/operations/utils";
import {
  MpbsStatusIcon,
  DEFAULT_REMEDIAL_COSTS_AMOUNT,
  DEFAULT_REMEDIAL_COSTS_DUE_DATETIME,
} from "@/operations/fees/utils";
import {formatDate, toUTC} from "@/utils/date";
import {FeesDialog} from "./FeesDialog";
import authProvider from "@/providers/authProvider";

interface CreateProps {
  onSuccess: () => void;
}

interface TransformData {
  psp_id?: string;
  psp_type?: MobileMoneyType;
}

const TRANSACTION_PATTERN =
  /^MP[a-zA-Z0-9]{6}\.[a-zA-Z0-9]{4}\.[a-zA-Z0-9]{6}$/;

const pspIdValidationContraints = [
  minLength(20, "La référence doit contenir exactement 20 caractères"),
  regex(
    TRANSACTION_PATTERN,
    "La référence n'est pas saisie correctement (ex : MP123456.1234.B12345)"
  ),
];

const DefaultInfos = () => {
  return (
    <FormDataConsumer>
      {({formData}) => {
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

const CatchupFeesCreate: FC<CreateProps> = ({onSuccess}) => {
  const notify = useNotify();
  const {data: courses = []} = useGetList("course", {
    pagination: {perPage: 50, page: 1},
  });
  const {id: student_id} = authProvider.getCachedWhoami();

  return (
    <Create
      resource="fees"
      title=" "
      redirect={false}
      mutationOptions={{
        onSuccess: () => {
          notify("Frais créés avec succès", {type: "success"});
          onSuccess();
        },
      }}
      transform={(
        data: {
          course_list: Course[];
        } = {course_list: []}
      ) => {
        return data.course_list.map((course: Course) => ({
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

const MpbsCreate: FC<CreateProps & {feeToPay: Fee}> = ({
  onSuccess,
  feeToPay,
}) => {
  const notify = useNotify();

  const {id: fee_id, mpbs} = feeToPay;
  const {id: student_id} = authProvider.getCachedWhoami();

  const handleError = (error: AxiosError) => {
    if (!error.response) return;

    const messages: Record<number, string> = {
      500: "Cette référence de transaction existe déjà",
      404: "Transaction non trouvée chez Orange",
    };

    const message =
      messages[error.response.status] || "Une erreur inattendue s'est produite";
    notify(message, {type: "error"});
  };

  return (
    <Create
      resource="fees"
      title=" "
      redirect={false}
      mutationOptions={{
        onSuccess: () => {
          notify("Frais créés avec succès", {type: "success"});
          onSuccess();
        },
        onError: (error: AxiosError) => handleError(error),
      }}
      transform={(data: TransformData = {}) => ({
        ...data,
        student_id,
        fee_id,
        mpbs_id: mpbs?.id,
      })}
    >
      <SimpleForm>
        <TextInput
          source="psp_id"
          label="Référence de la transaction"
          validate={pspIdValidationContraints}
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

const ListActionButtons: FC<{studentId: string}> = ({studentId}) => {
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
        <MpbsCreate onSuccess={toggle3} feeToPay={{id: id.toString(), mpbs}} />
      </FeesDialog>
      <CreateLettersDialog
        isOpen={show4}
        onClose={() => {
          toggle4();
          refresh();
        }}
        userId={studentId}
        feeAmount={total_amount}
        feeId={id}
        title="Payer mon frais par ajout d'un bordereau"
      />
    </Box>
  );
};

export const StudentFeeList = () => {
  const {studentRef, studentId} = useStudentRef("studentId");
  const [showCatchupFees, _set, toggleCatchupFees] = useToggle();
  const [showRightFee, _set3, toggleRightFee] = useToggle();

  const {data: fees = []} = useGetList("fees", {
    pagination: {page: 1, perPage: 100},
    filter: {studentId},
  });

  const sortedFees = useMemo(
    () =>
      [...fees].sort(
        (a, b) =>
          new Date(a.due_datetime!).getTime() -
          new Date(b.due_datetime!).getTime()
      ),
    [fees]
  );

  const nextFeeToPay = useMemo(
    () =>
      sortedFees.find(
        (fee, i) =>
          fee.status === FeeStatusEnum.UNPAID &&
          sortedFees
            .slice(0, i)
            .every(
              (prevFee) =>
                prevFee.status === FeeStatusEnum.PAID &&
                !fee.comment?.includes("Rattrapage")
            )
      ),
    [fees, sortedFees]
  );

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
                icon={<PayIcon />}
                onClick={toggleRightFee}
                style={{
                  backgroundColor: PALETTE_COLORS.red,
                  color: PALETTE_COLORS.white,
                }}
              >
                Payer mon écolage
              </ButtonBase>
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
          render={(record: {remaining_amount: number}) =>
            renderMoney(record.remaining_amount)
          }
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
        children={<CatchupFeesCreate onSuccess={toggleCatchupFees} />}
        show={showCatchupFees}
        toggle={toggleCatchupFees}
      />
      <FeesDialog
        title="ssfois"
        children={
          <MpbsCreate onSuccess={toggleRightFee} feeToPay={nextFeeToPay} />
        }
        show={showRightFee}
        toggle={toggleRightFee}
      />
    </Box>
  );
};
