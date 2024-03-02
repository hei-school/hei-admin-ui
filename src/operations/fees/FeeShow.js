import {useState, useEffect} from "react";
import {
  FunctionField,
  SimpleShowLayout,
  Show,
  useDataProvider,
  EditButton,
  TopToolbar,
} from "react-admin";
import {useParams} from "react-router-dom";
import {Divider, Typography} from "@mui/material";
import {useRole} from "../../security/hooks";
import {
  withRedWarning,
  commentFunctionRenderer,
} from "../utils";
import {renderPrettyMoney} from "../common/utils/money";
import PaymentList from "../payments/PaymentList";
import {studentIdFromRaId} from "../../providers/feeProvider";
import {DeleteWithConfirm} from "../common/components";
import {DateField} from "../common/components/fields";
import { getFeesStatusInFr } from "../common/utils/typo_util";

const renderDateTimeField = (data) => {
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

export const FeeLayout = ({feeId}) => {
  return (
    <SimpleShowLayout>
      <DateField
        label="Date de création"
        source="creation_datetime"
        showTime={false}
      />
      <DateField
        label="Date limite de paiement"
        source="due_datetime"
        showTime={false}
      />
      <FunctionField
        source="comment"
        render={commentFunctionRenderer}
        label="Commentaire"
      />
      <FunctionField
        label="Total à payer"
        render={(record) => renderPrettyMoney(record.total_amount)}
        textAlign="right"
      />
      <FunctionField
        label="Reste à payer"
        render={(record) => renderPrettyMoney(record.remaining_amount)}
        textAlign="right"
      />
      <FunctionField
        label="Statut"
        render={(record) =>
          record.status === "LATE"
            ? withRedWarning(getFeesStatusInFr(record.status))
            : getFeesStatusInFr(record.status)
        }
      />
      <FunctionField
        label="Date et heure de dernière modification"
        render={renderDateTimeField}
      />
      <Divider sx={{mt: 2, mb: 1}} />
      <Typography>Paiements</Typography>
      <PaymentList feeId={feeId} />
    </SimpleShowLayout>
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
      <FeeLayout feeId={feeId} />
    </Show>
  );
};

export default FeeShow;
