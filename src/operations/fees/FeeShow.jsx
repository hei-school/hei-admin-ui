import {useState, useEffect} from "react";
import {
  FunctionField,
  useDataProvider,
  EditButton,
  TopToolbar,
  SimpleShowLayout,
  TextField,
  UrlField,
} from "react-admin";
import {useParams} from "react-router-dom";
import {
  Divider,
  Chip,
  Typography,
  Grid,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {ExpandMore, Info} from "@mui/icons-material";
import {useRole} from "@/security/hooks";
import {studentIdFromRaId} from "@/providers/feeProvider";
import {statusRenderer, commentFunctionRenderer} from "@/operations/utils";
import {DeleteWithConfirm, Show} from "@/operations/common/components";
import {DateField} from "@/operations/common/components/fields";
import {renderMoney} from "@/operations/common/utils/money";
import PaymentList from "@/operations/payments/PaymentList";
import {PALETTE_COLORS} from "@/haTheme";
import {
  EventNoteOutlined,
  InfoOutlined,
  ChatBubbleOutline,
  AccessTimeOutlined,
} from "@mui/icons-material";
import {GRID_STYLE} from "@/operations/fees/utils/gridStyle";
import {EMPTY_TEXT} from "@/ui/constants";
import {PSP_COLORS, PSP_VALUES} from "./utils";

const dateTimeRenderer = (data) => {
  return data.updated_at == null ? (
    <DateField source="creation_datetime" showTime />
  ) : (
    <DateField
      source="updated_at"
      label="Date et heure de dernière modification"
      showTime
    />
  );
};

const LabeledField = ({label, icon, children}) => (
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

const AccordionBase = ({title, children}) => (
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

const FeePaymentDetails = () => (
  <Box>
    <AccordionBase title="Informations sur le dernier paiement par Mobile Money">
      <SimpleShowLayout>
        <DateField
          source="mpbs.creation_datetime"
          label="Ajout de la référence de transaction"
          showTime
        />
        <TextField
          source="mpbs.psp_id"
          label="Référence de la transaction"
          emptyText={EMPTY_TEXT}
        />
        <DateField
          source="mpbs.successfully_verified_on"
          label="Vérification réussie"
          showTime
        />
        <DateField
          source="mpbs.psp_own_datetime_verification"
          label="Vérification par PSP"
          showTime
        />
        <DateField
          source="mpbs.last_datetime_verification"
          label="Dernière vérification par HEI"
          showTime
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
      </SimpleShowLayout>
    </AccordionBase>
    <AccordionBase title="Informations sur le dernier paiement par ajout de bordereau">
      <SimpleShowLayout>
        <DateField
          source="letter.creation_datetime"
          label="Ajout du bordereau"
          showTime
        />
        <TextField
          source="letter.ref"
          label="Référence du bordereau"
          emptyText={EMPTY_TEXT}
        />
        <DateField
          source="letter.approval_datetime"
          label="Acceptation du bordereau"
          showTime
        />
        <UrlField
          source="letter.file_url"
          label="Lien du bordereau"
          emptyText={EMPTY_TEXT}
        />
      </SimpleShowLayout>
    </AccordionBase>
  </Box>
);

export const FeeLayout = ({feeId, studentId}) => {
  const styles = GRID_STYLE();
  return (
    <Box container spacing={2} m={6}>
      <Typography
        variant="h4"
        sx={{
          fontSize: "1.5em",
          fontWeight: "bold",
          mb: "2em",
        }}
        gutterBottom
      >
        Détails du frais
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        <Grid item {...styles.item}>
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
              render={(record) => renderMoney(record.remaining_amount)}
              textAlign="right"
              sx={{
                ...styles.font,
                color: PALETTE_COLORS.yellow,
              }}
            />
          </LabeledField>
          <LabeledField label="Total à payer">
            <FunctionField
              source="total_amount"
              render={(record) => renderMoney(record.total_amount)}
              textAlign="right"
              sx={{
                ...styles.font,
                color: PALETTE_COLORS.primary,
              }}
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

        <Grid item {...styles.item}>
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
              showTime={false}
              sx={{
                ...styles.font,
                color: PALETTE_COLORS.yellow,
              }}
            />
          </LabeledField>
          <LabeledField label="Date de création">
            <DateField
              source="creation_datetime"
              showTime={false}
              sx={{
                ...styles.font,
                color: PALETTE_COLORS.primary,
              }}
            />
          </LabeledField>
          <LabeledField label="Statut">
            <Box {...styles.box}>
              <FunctionField
                source="status"
                render={(record) => statusRenderer(record.status)}
              />
            </Box>
          </LabeledField>
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
          sx={{
            fontSize: "1.5em",
            fontWeight: "bold",
          }}
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
  const params = useParams();
  const feeId = params.feeId;
  const studentId = studentIdFromRaId(feeId);
  const [studentRef, setStudentRef] = useState("...");
  const dataProvider = useDataProvider();

  useEffect(() => {
    const doEffect = async () => {
      const student = await dataProvider.getOne("students", {id: studentId});
      setStudentRef(student.data.ref);
    };
    doEffect();
    // eslint-disable-next-line
  }, [studentId]);

  return (
    <Show
      id={feeId}
      resource="fees"
      actions={
        role.isManager() && (
          <TopToolbar>
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
  );
};

export default FeeShow;
