import {FILE_FIELD_STYLE} from "@/operations/common/components/FileUploadDialog";
import {
  SmsContact,
  SmsContactOwnerRole,
} from "@haapi-b0fc7615/typescript-client";
import {Campaign as SmsCampaignIcon} from "@mui/icons-material";
import {
  Box,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {useState} from "react";
import {
  DateTimeInput,
  FileField,
  FileInput,
  required,
  SaveButton,
  SelectArrayInput,
  SimpleForm,
  TextInput,
  Toolbar,
  useGetList,
} from "react-admin";
import {FieldValues, useWatch} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {SMS_OWNER_ROLE_LABEL} from "./constants";
import {SendSmsCampaignInput, useSendSmsCampaign} from "./useSendSmsCampaign";

type SmsCampaignSource = SendSmsCampaignInput["source"];

const SOURCE_LABEL: Record<SmsCampaignSource, string> = {
  groups: "Groupes de contacts",
  contacts: "Contacts",
  manual: "Numéros manuels",
  file: "Fichier",
};

const contactLabel = (contact: SmsContact) =>
  [
    contact.name,
    contact.phoneNumber,
    contact.ownerRole
      ? SMS_OWNER_ROLE_LABEL[contact.ownerRole as SmsContactOwnerRole]
      : undefined,
  ]
    .filter(Boolean)
    .join(" — ");

const parseManualPhoneNumbers = (value?: string) =>
  (value ?? "")
    .split(/[\n,;]+/)
    .map((phoneNumber) => phoneNumber.trim())
    .filter(Boolean);

const extractFile = (value: unknown): File | undefined => {
  if (!value) return undefined;
  if (value instanceof File) return value;
  const rawFile = (value as {rawFile?: unknown}).rawFile;
  return rawFile instanceof File ? rawFile : undefined;
};

// Le backend interprète sendAt comme s'il était en heure locale GMT+3
// (Madagascar) au lieu de le convertir depuis l'UTC envoyé par le navigateur :
// on retranche donc 3h à l'heure choisie par l'utilisateur avant l'envoi, pour
// toutes les sources de campagne (groupes, contacts, numéros, fichier).
const TIMEZONE_OFFSET_MS = 3 * 60 * 60 * 1000;

const toSendAt = (value: unknown): Date | undefined => {
  if (!value) return undefined;
  return new Date(new Date(value as string).getTime() - TIMEZONE_OFFSET_MS);
};

const MessageInput = ({isRequired}: {isRequired: boolean}) => {
  const message: string = useWatch({name: "message"}) ?? "";
  return (
    <Box sx={{width: "100%"}}>
      <TextInput
        source="message"
        label={
          isRequired
            ? "Message"
            : "Message (optionnel si le fichier est déjà personnalisé)"
        }
        multiline
        minRows={4}
        fullWidth
        validate={isRequired ? required() : undefined}
      />
      <Typography variant="caption" color="text.secondary">
        {message.length} caractère(s)
      </Typography>
    </Box>
  );
};

const SmsCampaignFormToolbar = ({isLoading}: {isLoading: boolean}) => (
  <Toolbar>
    <SaveButton
      label="Envoyer la campagne"
      disabled={isLoading}
      data-testid="send-sms-campaign"
    />
  </Toolbar>
);

const GroupsFields = () => {
  const {data: contactGroups = []} = useGetList("sms-contact-groups", {
    pagination: {page: 1, perPage: 500},
  });
  return (
    <SelectArrayInput
      source="contactGroupIds"
      label="Groupes de contacts"
      choices={contactGroups}
      optionText="name"
      validate={required()}
      fullWidth
    />
  );
};

const ContactsFields = () => {
  const {data: contacts = []} = useGetList("sms-contacts", {
    pagination: {page: 1, perPage: 500},
  });
  return (
    <SelectArrayInput
      source="contactIds"
      label="Contacts"
      choices={contacts}
      optionText={contactLabel}
      validate={required()}
      fullWidth
    />
  );
};

const ManualNumbersFields = () => (
  <TextInput
    source="manualPhoneNumbers"
    label="Numéros manuels (un par ligne ou séparés par une virgule)"
    multiline
    minRows={2}
    fullWidth
    validate={required()}
  />
);

const FileFields = () => (
  <FileInput
    source="file"
    label="Fichier de destinataires (.csv, .xlsx)"
    accept=".csv,.xlsx"
    sx={FILE_FIELD_STYLE}
    validate={required()}
  >
    <FileField source="src" title="title" />
  </FileInput>
);

const SmsCampaignFormContent = ({source}: {source: SmsCampaignSource}) => (
  <>
    <MessageInput isRequired={source !== "file"} />
    {source === "groups" && <GroupsFields />}
    {source === "contacts" && <ContactsFields />}
    {source === "manual" && <ManualNumbersFields />}
    {source === "file" && <FileFields />}
    <DateTimeInput
      source="sendAt"
      label="Programmer l'envoi (optionnel, immédiat sinon)"
      fullWidth
    />
  </>
);

export const SmsCampaignCreate = () => {
  const navigate = useNavigate();
  const {send, isLoading} = useSendSmsCampaign();
  const [source, setSource] = useState<SmsCampaignSource>("groups");

  const handleSubmit = (values: FieldValues) => {
    const sendAt = toSendAt(values.sendAt);

    switch (source) {
      case "groups":
        send({
          source,
          message: values.message,
          contactGroupIds: values.contactGroupIds ?? [],
          sendAt,
        });
        return;
      case "contacts":
        send({
          source,
          message: values.message,
          contactIds: values.contactIds ?? [],
          sendAt,
        });
        return;
      case "manual":
        send({
          source,
          message: values.message,
          manualPhoneNumbers: parseManualPhoneNumbers(
            values.manualPhoneNumbers
          ),
          sendAt,
        });
        return;
      case "file": {
        const file = extractFile(values.file);
        if (!file) return;
        send({source, message: values.message || undefined, file, sendAt});
      }
    }
  };

  return (
    <Box sx={{maxWidth: 800, mx: "auto", p: 3}}>
      <Box sx={{display: "flex", alignItems: "center", gap: 1.5, mb: 2}}>
        <SmsCampaignIcon />
        <Typography variant="h5">Nouvelle campagne SMS</Typography>
        <Button
          size="small"
          sx={{ml: "auto"}}
          onClick={() => navigate("/sms-campaigns")}
        >
          Retour aux campagnes
        </Button>
      </Box>
      <ToggleButtonGroup
        exclusive
        color="primary"
        value={source}
        onChange={(_event, value: SmsCampaignSource | null) =>
          value && setSource(value)
        }
        sx={{mb: 3}}
      >
        {(Object.keys(SOURCE_LABEL) as SmsCampaignSource[]).map((key) => (
          <ToggleButton key={key} value={key} data-testid={`sms-source-${key}`}>
            {SOURCE_LABEL[key]}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <SimpleForm
        key={source}
        onSubmit={handleSubmit}
        defaultValues={{
          message: "",
          manualPhoneNumbers: "",
          contactGroupIds: [],
          contactIds: [],
        }}
        toolbar={<SmsCampaignFormToolbar isLoading={isLoading} />}
      >
        <SmsCampaignFormContent source={source} />
      </SimpleForm>
    </Box>
  );
};
