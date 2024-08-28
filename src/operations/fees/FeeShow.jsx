import {useState, useEffect} from "react";
import {
  FunctionField,
  SimpleShowLayout,
  useDataProvider,
  EditButton,
  TopToolbar,
} from "react-admin";
import {useParams} from "react-router-dom";
import {Divider, Typography, Grid, Box} from "@mui/material";
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
import {gridStyle} from "@/operations/fees/utils";

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
          color: PALETTE_COLORS.white,
        }}
      >
        {label}
      </Typography>
    </Box>
    <Box>{children}</Box>
  </Grid>
);

export const FeeLayout = ({feeId}) => {
  const styles = gridStyle();
  return (
    <Box container spacing={2} m={6}>
      <Typography
        variant="h4"
        sx={{color: PALETTE_COLORS.primary, mb: "1.5em", fontWeight: "bold"}}
      >
        Détails du paiement
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
            }}
          >
            <InfoOutlined sx={{color: PALETTE_COLORS.yellow, mr: 1}} />
            Informations de paiement
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
                color: PALETTE_COLORS.white,
              }}
            />
          </LabeledField>
          <Box
            sx={{
              backgroundColor: "#002a6e",
              border: "solid 1px #003694",
              borderRadius: "5px",
              padding: "1em",
              marginTop: "1em",
              color: PALETTE_COLORS.white,
            }}
          >
            <Box {...styles.box}>
              <ChatBubbleOutline
                sx={{color: PALETTE_COLORS.yellow, marginRight: "0.5em"}}
              />
              <Typography
                variant="subtitle1"
                sx={{
                  color: PALETTE_COLORS.yellow,
                  fontWeight: "bold",
                  fontSize: "1.3em",
                }}
              >
                Commentaire
              </Typography>
            </Box>
            <FunctionField
              source="comment"
              render={commentFunctionRenderer}
              sx={{color: PALETTE_COLORS.white, fontSize: "1em"}}
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
            <EventNoteOutlined sx={{color: PALETTE_COLORS.yellow, mr: 1}} />
            Dates importantes
          </Typography>
          <LabeledField label="Date limite de paiement">
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
              {...styles.font}
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
      <Grid item xs={12}>
        <Typography sx={{...styles.box, color: "#495057"}}>
          <AccessTimeOutlined sx={{marginRight: "0.2em"}} />
          Dernière modification:
          <FunctionField source="last_modified" render={dateTimeRenderer} />
        </Typography>
      </Grid>
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
        <PaymentList feeId={feeId} />
      </Grid>
    </Box>
  );
};

const FeeShow = (props) => {
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
      <FeeLayout feeId={feeId} />
    </Show>
  );
};

export default FeeShow;
