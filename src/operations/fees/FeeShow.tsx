import {PALETTE_COLORS} from "@/haTheme";
import {DeleteWithConfirm, Show} from "@/operations/common/components";
import {DateField} from "@/operations/common/components/fields";
import {renderMoney} from "@/operations/common/utils/money";
import {ARCHIVE_STATUS_LABEL} from "@/operations/fees/constants";
import {GRID_STYLE} from "@/operations/fees/utils/gridStyle";
import PaymentList from "@/operations/payments/PaymentList";
import {useReservedCredit} from "@/operations/payments/utils/validateCredit";
import {commentFunctionRenderer, statusRenderer} from "@/operations/utils";
import {studentIdFromRaId} from "@/providers/feeProvider";
import {useRole} from "@/security/hooks";
import {EMPTY_TEXT} from "@/ui/constants";
import {formatDate} from "@/utils/date";
import {
  ArchiveStatusEnum,
  Fee,
  FeeStatusEnum,
} from "@haapi-b0fc7615/typescript-client";
import {
  AccessTimeOutlined,
  ChatBubbleOutline,
  EventNoteOutlined,
  ExpandMore,
  Info,
  InfoOutlined,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {Home} from "lucide-react";
import {ReactElement, ReactNode, useEffect, useState} from "react";
import {
  EditButton,
  FunctionField,
  SimpleShowLayout,
  TopToolbar,
  useDataProvider,
  useRecordContext,
} from "react-admin";
import {Link as RouterLink, useParams} from "react-router-dom";
import CustomBreadcrumbs from "../utils/CustomBreadcrumbs";
import {PSP_COLORS, PSP_VALUES} from "./utils";

type LabeledFieldProps = {
  label: string;
  icon?: ReactElement;
  children: ReactNode;
};

type FeeLayoutProps = {
  feeId: string;
  studentId: string;
};

type AccordionProps = {
  title: string;
  children: ReactNode;
};

const LabeledField = ({label, icon, children}: LabeledFieldProps) => (
  <Grid
    item
    xs={12}
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      marginBottom: "1.5em",
    }}
  >
    <Box sx={{display: "flex", alignItems: "center"}}>
      {icon && <Box sx={{mr: 1}}>{icon}</Box>}
      <Typography
        variant="subtitle1"
        sx={{
          fontSize: "1.2em",
          color: "#2f2f2f",
        }}
      >
        {label}
      </Typography>
    </Box>
    <Box>{children}</Box>
  </Grid>
);

const AccordionBase = ({title, children}: AccordionProps) => (
  <Accordion sx={{boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px"}}>
    <AccordionSummary expandIcon={<ExpandMore />}>
      <Info color="warning" sx={{mx: 1}} />
      <Typography fontWeight="bold" color={PALETTE_COLORS.typography.grey}>
        {title}
      </Typography>
    </AccordionSummary>
    <AccordionDetails>{children}</AccordionDetails>
  </Accordion>
);

const ARCHIVE_STATUS_COLOR: Record<
  ArchiveStatusEnum,
  "warning" | "default" | "error"
> = {
  TO_ARCHIVE: "warning",
  ARCHIVED: "default",
  REJECTED: "error",
};

const ArchiveStatusField = () => {
  const record = useRecordContext<Fee>();
  if (!record?.archive_status) {
    return null;
  }
  const treatedByName = [
    record.archived_by_first_name,
    record.archived_by_last_name,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <LabeledField label="Archivage">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 0.5,
        }}
      >
        <Chip
          size="small"
          label={
            ARCHIVE_STATUS_LABEL[record.archive_status] ?? record.archive_status
          }
          color={ARCHIVE_STATUS_COLOR[record.archive_status] ?? "default"}
        />
        {treatedByName && (
          <Typography variant="caption" color="text.secondary">
            {record.archive_status === "TO_ARCHIVE"
              ? "Demandé"
              : record.archive_status === "REJECTED"
                ? "Rejeté"
                : "Archivé"}{" "}
            par {treatedByName}
            {record.archived_by_ref ? ` (${record.archived_by_ref})` : ""}
          </Typography>
        )}
      </Box>
    </LabeledField>
  );
};

const FeeStatusField = ({studentId}: {studentId: string}) => {
  const record = useRecordContext<Fee>();
  const {pendingCreditFeeIds} = useReservedCredit(studentId);
  const hasPendingCreditPayment =
    !!record?.id &&
    record.status !== FeeStatusEnum.PAID &&
    pendingCreditFeeIds.has(record.id);
  return statusRenderer(
    hasPendingCreditPayment ? FeeStatusEnum.PENDING : record?.status
  );
};

const dateTimeRenderer = (data: Fee) => {
  return data.updated_at == null ? (
    <DateField
      label="Date et heure de dernière modification"
      source="creation_datetime"
      showTime
    />
  ) : (
    <DateField
      source="updated_at"
      label="Date et heure de dernière modification"
      showTime
    />
  );
};

const FeePaymentDetails = () => (
  <Box>
    <AccordionBase title="Informations sur le dernier paiement par Mobile Money">
      <SimpleShowLayout>
        <FunctionField
          render={(fee) => formatDate(fee?.mpbs?.at(-1)?.creation_datetime)}
          label="Ajout de la référence de transaction"
        />
        <FunctionField
          render={(fee) => fee?.mpbs?.at(-1)?.psp_id}
          label="Référence de la transaction"
          emptyText={EMPTY_TEXT}
        />
        <FunctionField
          render={(fee) =>
            formatDate(fee?.mpbs?.at(-1)?.last_datetime_verification)
          }
          label="Dernière vérification par HEI"
        />
        <FunctionField
          render={(fee) =>
            formatDate(fee?.mpbs?.at(-1)?.psp_own_datetime_verification)
          }
          label="Vérification par PSP"
        />
        <FunctionField
          render={(fee) =>
            formatDate(fee?.mpbs?.at(-1)?.successfully_verified_on)
          }
          label="Vérification réussie"
        />
        <FunctionField
          render={(fee: Fee) => {
            if (fee?.mpbs?.at(-1)?.psp_type) {
              return (
                <Chip
                  color={PSP_COLORS[fee.mpbs?.at(-1)?.psp_type!]}
                  label={PSP_VALUES[fee.mpbs?.at(-1)?.psp_type!]}
                />
              );
            }
            return EMPTY_TEXT;
          }}
          label="Type de transaction"
          emptyText={EMPTY_TEXT}
        />
      </SimpleShowLayout>
    </AccordionBase>
  </Box>
);

export const FeeLayout = ({feeId, studentId}: FeeLayoutProps) => {
  const isSmall = useMediaQuery("(max-width:900px)");
  const styles = GRID_STYLE(isSmall);

  return (
    <Box m={isSmall ? 2 : 6} sx={{width: isSmall ? "100%" : "auto"}}>
      <Typography
        variant="h4"
        sx={{fontSize: "1.5em", fontWeight: "bold", mb: "1em", mt: "1em"}}
        gutterBottom
      >
        Détails du frais
      </Typography>
      <Grid
        container
        spacing={4}
        gap={4}
        justifyContent="center"
        sx={{
          display: "flex",
          flexDirection: isSmall ? "column" : "row",
          justifyContent: "flex-start",
          margin: {xs: "1em 0", sm: "1em"},
          width: "100%",
        }}
      >
        <Grid
          item
          {...styles.item}
          sx={{
            width: isSmall ? "90%" : "45%",
            padding: isSmall ? "1.5rem" : "2em",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              ...styles.box,
              fontSize: "1.5em",
              mb: "2em",
              fontWeight: "bold",
              color: PALETTE_COLORS.primary,
            }}
          >
            <InfoOutlined sx={{color: "#2563eb", mr: 1}} />
            Informations sur le frais
          </Typography>
          <LabeledField label="Reste à payer">
            <FunctionField
              source="remaining_amount"
              render={(record: Fee) => renderMoney(record.remaining_amount!)}
              textAlign="right"
              sx={{...styles.font, color: PALETTE_COLORS.yellow}}
            />
          </LabeledField>
          <LabeledField label="Total à payer">
            <FunctionField
              source="total_amount"
              render={(record: Fee) => renderMoney(record.total_amount!)}
              textAlign="right"
              sx={{...styles.font, color: PALETTE_COLORS.primary}}
            />
          </LabeledField>
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "5px",
              padding: "1em",
              marginTop: "1em",
              boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
            }}
          >
            <Box {...styles.box}>
              <ChatBubbleOutline
                sx={{color: "#2563eb", marginRight: "0.5em"}}
              />
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.3em",
                  color: PALETTE_COLORS.primary,
                }}
              >
                Commentaire
              </Typography>
            </Box>
            <FunctionField
              source="comment"
              render={commentFunctionRenderer}
              sx={{fontSize: "1em"}}
            />
          </Box>
        </Grid>

        <Grid
          item
          {...styles.item}
          sx={{
            width: isSmall ? "90%" : "45%",
            padding: isSmall ? "1.5rem" : "2em",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              ...styles.box,
              fontSize: "1.5em",
              mb: "2em",
              fontWeight: "bold",
            }}
          >
            <EventNoteOutlined sx={{color: "#2563eb", mr: 1}} />
            Dates importantes
          </Typography>
          <LabeledField label="Date limite de paiement du frais">
            <DateField
              source="due_datetime"
              label=" "
              showTime={false}
              sx={{...styles.font, color: PALETTE_COLORS.yellow}}
            />
          </LabeledField>
          <LabeledField label="Date de création">
            <DateField
              source="creation_datetime"
              label=" "
              showTime={false}
              sx={{...styles.font, color: PALETTE_COLORS.primary}}
            />
          </LabeledField>
          <LabeledField label="Statut">
            <Box {...styles.box}>
              <FeeStatusField studentId={studentId} />
            </Box>
          </LabeledField>
          <ArchiveStatusField />
        </Grid>
      </Grid>

      <Grid item xs={12} sx={{margin: "1em 0"}}>
        <Typography sx={{...styles.box, color: "#495057"}}>
          <AccessTimeOutlined sx={{marginRight: "0.2em"}} />
          Dernière modification:
          <FunctionField
            source="last_modified"
            render={dateTimeRenderer}
            sx={{marginLeft: "0.5em"}}
          />
        </Typography>
      </Grid>
      <FeePaymentDetails />
      <Grid item xs={12}>
        <Divider sx={{mt: 3, mb: 2}} />
        <Typography
          variant="h4"
          sx={{fontSize: "1.5em", fontWeight: "bold"}}
          gutterBottom
        >
          Paiements
        </Typography>
        <PaymentList feeId={feeId} studentId={studentId} />
      </Grid>
    </Box>
  );
};

const FeeShow = () => {
  const role = useRole();
  const params = useParams<{feeId: string}>();
  const feeId = params.feeId!;
  const studentId = studentIdFromRaId(feeId);
  const dataProvider = useDataProvider();
  const [studentRef, setStudentRef] = useState("...");
  const isSmall = useMediaQuery("(max-width:900px)");

  useEffect(() => {
    const doEffect = async () => {
      const student = await dataProvider.getOne("students", {id: studentId});
      setStudentRef(student.data.ref);
    };
    doEffect();
  }, [studentId, dataProvider]);

  const breadcrumbItems = [
    {
      label: "Étudiant",
      component: RouterLink,
      to: `/students/${studentId}/show`,
      icon: <Home size={16} />,
    },
    {
      label: "Frais",
    },
  ];

  return (
    <>
      <Show
        id={feeId}
        resource="fees"
        actions={
          (role.isManager() || role.isAdmin()) && (
            <TopToolbar>
              <Box sx={{flexGrow: 1, ml: isSmall ? 0 : 2}}>
                <CustomBreadcrumbs items={breadcrumbItems} />
              </Box>
              <EditButton />
              <DeleteWithConfirm
                resourceType="fees"
                redirect={`/students/${studentId}/fees`}
                confirmTitle="Suppression de frais"
                confirmContent="Confirmez-vous la suppression de la ressource ?"
              />
            </TopToolbar>
          )
        }
        basePath={`/fees/${feeId}/show`}
        title={`Frais de ${studentRef}`}
      >
        <FeeLayout feeId={feeId} studentId={studentId} />
      </Show>
    </>
  );
};

export default FeeShow;
