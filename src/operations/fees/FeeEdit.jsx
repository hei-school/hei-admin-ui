import {Save} from "@mui/icons-material";
import {Box, CircularProgress} from "@mui/material";
import {useState} from "react";
import {
  Button,
  DateInput,
  DateTimeInput,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
  Toolbar,
  useEditController,
  useNotify,
  useRedirect,
} from "react-admin";
import {useFormContext} from "react-hook-form";

import {useStudentRef} from "../../hooks/useStudentRef";
import {payingApi} from "../../providers/api";
import {toApiIds} from "../../providers/feeProvider";
import {Edit} from "../common/components";
import {statusRenderer} from "../utils";

function EditToolbar() {
  const notify = useNotify();
  const redirect = useRedirect();
  const [pending, setPending] = useState(false);
  const {getValues} = useFormContext();
  const record = getValues();

  const updateFee = async () => {
    const {feeId} = toApiIds(record.id);
    const updated_at = new Date().toISOString();
    const due_datetime = new Date(record.due_datetime).toISOString();
    setPending(true);

    await payingApi()
      .updateStudentFees(record.student_id, [
        {...record, updated_at, id: feeId, due_datetime},
      ])
      .then(() => {
        notify("Frais mis à jour");
        redirect(`/fees/${record.id}/show`);
      })
      .catch(() => notify("Une erreur c'est produite", {type: "error"}))
      .finally(() => setPending(false));
  };

  return (
    <Toolbar>
      <Button
        variant="contained"
        disabled={pending || !record.due_datetime}
        size="medium"
        onClick={updateFee}
      >
        {pending ? (
          <CircularProgress size={20} sx={{mt: 0.3, mr: 1.5}} />
        ) : (
          <Save sx={{mr: 1, mt: 0.3}} />
        )}
        Enregistrer
      </Button>
    </Toolbar>
  );
}

function DisabledInfo() {
  const {record} = useEditController();
  let dateInfo = {label: "Date de création", source: "creation_datetime"};
  const props = {readOnly: true, fullWidth: true};

  if (record.udpated_at) {
    dateInfo = {
      label: "Date et heure de dernière modification",
      source: "udpated_at",
    };
  }

  return (
    <>
      <DateTimeInput {...dateInfo} {...props} />
      <Box sx={{display: "flex", width: "100%", gap: 1}}>
        <TextInput
          source="total_amount"
          sx={{flex: 1}}
          label="Total à payer"
          readOnly
        />
        <TextInput
          source="remaining_amount"
          sx={{flex: 1}}
          readOnly
          label="Reste à payer"
        />
        <SelectInput
          label="Statut"
          source="status"
          choices={[{id: record.status, name: statusRenderer(record.status)}]}
          {...props}
          sx={{flex: 1}}
        />
      </Box>
    </>
  );
}

function FeeEdit() {
  const {studentRef} = useStudentRef("id");

  return (
    <Edit title={`Frais de ${studentRef}`}>
      <SimpleForm toolbar={<EditToolbar />}>
        <DisabledInfo />
        <DateInput
          source="due_datetime"
          validate={required()}
          label="Date limite de paiement"
          fullWidth
        />
        <TextInput
          multiline
          validate={required()}
          source="comment"
          label="Commentaire"
          fullWidth
        />
      </SimpleForm>
    </Edit>
  );
}

export default FeeEdit;
