import {PALETTE_COLORS} from "@/haTheme";
import {useNotify, useToggle} from "@/hooks";
import {useStudentRef} from "@/hooks/useStudentRef";
import {Create} from "@/operations/common/components";
import {DateField} from "@/operations/common/components/fields";
import {renderMoney} from "@/operations/common/utils/money";
import {
  DEFAULT_REMEDIAL_COSTS_AMOUNT,
  DEFAULT_REMEDIAL_COSTS_DUE_DATETIME,
  MpbsStatusIcon,
} from "@/operations/fees/utils";
import {CreateLettersDialog} from "@/operations/letters/CreateLetters";
import {
  commentFunctionRenderer,
  IconButtonWithTooltip,
  pspIdValidationContraints,
} from "@/operations/utils";
import authProvider from "@/providers/authProvider";
import {HaList} from "@/ui/haList/HaList";
import {ButtonBase, HaActionWrapper} from "@/ui/haToolbar";
import {formatDate, toUTC} from "@/utils/date";
import {
  Course,
  CrupdateFeeTemplate,
  Fee,
  FeeStatusEnum,
  FeeTypeEnum,
  LetterStatus,
  MobileMoneyType,
  MpbsStatus,
} from "@haapi-b0fc7615/typescript-client";
import {
  AddCard as AddMbpsIcon,
  Payment as PayIcon,
  Visibility as ShowIcon,
  WarningOutlined,
} from "@mui/icons-material";
import {Box, TextField as MuiTextInput, Typography} from "@mui/material";
import {AxiosError} from "axios";
import {FC, useMemo, useState} from "react";
import {
  FormDataConsumer,
  FunctionField,
  Link,
  SelectArrayInput,
  SelectInput,
  SimpleForm,
  TextInput,
  useGetList,
  useRefresh,
} from "react-admin";
import {FeesDialog} from "./FeesDialog";
import {OrangeMoneyHeader} from "./OrangeMoneyHeader";

interface CreateProps {
  onSuccess: () => void;
}

interface MpbsCreateProps {
  onSuccess: () => void;
  fee: Fee;
}

const isCatchUp = (fee: Fee): boolean => {
  return fee.type === FeeTypeEnum.RETAKE_EXAM_COSTS;
};

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
      transform={(data: {course_list: Course[]} = {course_list: []}) => {
        return data.course_list.map((course: Course) => ({
          type: FeeTypeEnum.RETAKE_EXAM_COSTS,
          comment: `Rattrapage ${course.code}`,
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

const MpbsCreate: FC<MpbsCreateProps> = ({onSuccess, fee}) => {
  const notify = useNotify();
  const {id: student_id} = authProvider.getCachedWhoami();
  const lastMpbs =
    fee.mpbs && fee.mpbs.length > 0 ? fee.mpbs[fee.mpbs.length - 1] : undefined;

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
          notify("Paiement enregistré avec succès", {type: "success"});
          onSuccess();
        },
        onError: handleError,
      }}
      transform={(data: CrupdateFeeTemplate = {}) => ({
        ...data,
        student_id,
        fee_id: fee.id,
        mpbs_id: lastMpbs?.id,
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

export const StudentFeeList = () => {
  const notify = useNotify();
  const {studentRef, studentId} = useStudentRef("studentId");
  const refresh = useRefresh();

  const [showCatchupFees, , toggleCatchupFees] = useToggle();
  const [feeToPay, setFeeToPay] = useState<Fee | null>(null);
  const [feeForLetter, setFeeForLetter] = useState<Fee | null>(null);

  const {data: fees = []} = useGetList("fees", {
    pagination: {page: 1, perPage: 100},
    filter: {studentId},
    sort: {field: "due_datetime", order: "ASC"},
  });

  const firstUnpaidNormalFee = useMemo(() => {
    const sorted = [...fees].sort((a, b) => {
      const dateA = new Date(a.due_datetime!).getTime();
      const dateB = new Date(b.due_datetime!).getTime();
      return dateA - dateB;
    });

    return sorted.find(
      (fee) => fee.status !== FeeStatusEnum.PAID && !isCatchUp(fee)
    );
  }, [fees]);

  const isFirstFeePending = useMemo(() => {
    if (!firstUnpaidNormalFee) return false;
    const lastMpbs = firstUnpaidNormalFee.mpbs?.at(-1);
    return lastMpbs?.status === MpbsStatus.PENDING;
  }, [firstUnpaidNormalFee]);

  const canPayFee = (currentFee: Fee) => {
    if (currentFee.status === FeeStatusEnum.PAID) return false;
    if (isCatchUp(currentFee)) return true;
    if (!firstUnpaidNormalFee) return true;

    const currentFeeDate = new Date(currentFee.due_datetime!).getTime();
    const blockingFeeDate = new Date(
      firstUnpaidNormalFee.due_datetime!
    ).getTime();

    return currentFeeDate <= blockingFeeDate;
  };

  return (
    <Box>
      <OrangeMoneyHeader />
      <HaList
        wrapperSx={{marginTop: 2}}
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
                disabled={!firstUnpaidNormalFee}
                onClick={() => {
                  if (!firstUnpaidNormalFee || isFirstFeePending) {
                    notify("Vous êtes à jour dans vos écolages", {
                      type: "info",
                    });
                    return;
                  }

                  if (isFirstFeePending) {
                    notify(
                      "Le paiement de ce frais est déjà en cours de vérification.",
                      {type: "warning"}
                    );
                    return;
                  }

                  setFeeToPay(firstUnpaidNormalFee);
                }}
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
          render={(record: Fee) => renderMoney(record.remaining_amount!)}
        />
        <FunctionField
          source="comment"
          render={commentFunctionRenderer}
          label="Commentaire"
        />

        <FunctionField
          render={(fee: Fee) =>
            formatDate(fee?.mpbs?.at(-1)?.creation_datetime)
          }
          label="Ajout de la référence de transaction"
        />
        <FunctionField
          render={(fee: Fee) =>
            formatDate(fee?.mpbs?.at(-1)?.last_datetime_verification)
          }
          label="Dernière vérification par HEI"
        />
        <FunctionField
          render={(fee: Fee) =>
            formatDate(fee?.mpbs?.at(-1)?.psp_own_datetime_verification)
          }
          label="Vérification par PSP"
        />
        <FunctionField
          render={(fee: Fee) =>
            formatDate(fee?.mpbs?.at(-1)?.successfully_verified_on)
          }
          label="Vérification réussie"
        />

        <FunctionField
          label="Actions"
          render={(fee: Fee) => {
            const isPayable = canPayFee(fee);
            const lastMpbs = fee.mpbs?.at(-1);
            const isPendingOrSuccess =
              lastMpbs &&
              (lastMpbs.status === MpbsStatus.PENDING ||
                lastMpbs.status === MpbsStatus.SUCCESS);

            const isRejectedLetter =
              fee.letter && fee.letter.status === LetterStatus.REJECTED;
            const hasLetter = fee.letter && !isRejectedLetter;

            return (
              <Box display="flex" alignItems="center">
                {isPendingOrSuccess ? (
                  <MpbsStatusIcon />
                ) : (
                  <IconButtonWithTooltip
                    title={
                      isPayable
                        ? "Mobile Money"
                        : "Veuillez payer les frais précédents d'abord"
                    }
                    disabled={!isPayable || hasLetter}
                  >
                    <AddMbpsIcon
                      onClick={() => setFeeToPay(fee)}
                      color={!isPayable || hasLetter ? "disabled" : undefined}
                      data-testid={`addMobileMoney-${fee.id}`}
                    />
                  </IconButtonWithTooltip>
                )}

                <Link
                  to={`/fees/${fee.id}/show`}
                  data-testid={`showButton-${fee.id}`}
                >
                  <IconButtonWithTooltip title="Afficher">
                    <ShowIcon />
                  </IconButtonWithTooltip>
                </Link>
              </Box>
            );
          }}
        />
      </HaList>

      <FeesDialog
        title="Créer mon/mes frais de rattrapage"
        show={showCatchupFees}
        toggle={toggleCatchupFees}
      >
        <CatchupFeesCreate onSuccess={toggleCatchupFees} />
      </FeesDialog>

      {feeToPay && (
        <FeesDialog
          title={`Paiement de mon frais par Mobile Money`}
          show={!!feeToPay}
          toggle={() => setFeeToPay(null)}
        >
          <MpbsCreate
            key={feeToPay.id}
            fee={feeToPay}
            onSuccess={() => setFeeToPay(null)}
          />
        </FeesDialog>
      )}

      {feeForLetter && (
        <CreateLettersDialog
          isOpen={!!feeForLetter}
          onClose={() => {
            setFeeForLetter(null);
            refresh();
          }}
          userId={studentId}
          feeAmount={feeForLetter.total_amount}
          feeId={feeForLetter.id}
          title="Payer mon frais par ajout d'un bordereau"
        />
      )}
    </Box>
  );
};
