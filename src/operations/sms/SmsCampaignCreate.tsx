import {FILE_FIELD_STYLE} from "@/operations/common/components/FileUploadDialog";
import {exportData} from "@/operations/utils";
import {SmsContact, SmsContactGroup} from "@haapi-b0fc7615/typescript-client";
import {
  Download as DownloadIcon,
  Campaign as SmsCampaignIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import {useState} from "react";
import {
  FileField,
  FileInput,
  required,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
} from "react-admin";
import {FieldValues, useWatch} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {SmsContactGroupMultiSelectInput} from "./SmsContactGroupMultiSelectInput";
import {SmsContactMultiSearchInput} from "./SmsContactMultiSearchInput";
import {SmsPhoneNumberChipsInput} from "./SmsPhoneNumberChipsInput";
import {SendSmsCampaignInput, useSendSmsCampaign} from "./useSendSmsCampaign";

type SmsCampaignSource = SendSmsCampaignInput["source"];

const SOURCE_LABEL: Record<SmsCampaignSource, string> = {
  groups: "Groupes de contacts",
  contacts: "Contacts",
  manual: "Numéros manuels",
  file: "Fichier",
};

const extractFile = (value: unknown): File | undefined => {
  if (!value) return undefined;
  if (value instanceof File) return value;
  const rawFile = (value as {rawFile?: unknown}).rawFile;
  return rawFile instanceof File ? rawFile : undefined;
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

const GroupsFields = () => (
  <SmsContactGroupMultiSelectInput
    source="contactGroups"
    label="Groupes de contacts"
    validate={required()}
  />
);

const ContactsFields = () => (
  <SmsContactMultiSearchInput
    source="contacts"
    label="Contacts"
    validate={required()}
  />
);

const ManualNumbersFields = () => (
  <SmsPhoneNumberChipsInput
    source="manualPhoneNumbers"
    label="Numéros manuels"
    validate={required()}
  />
);

const downloadSmsFileTemplate = () =>
  exportData(
    [],
    ["Destinataire", "Message (optionnel)"],
    "modele_sms_destinataires"
  );

const FileFields = () => (
  <>
    <Button
      size="small"
      startIcon={<DownloadIcon />}
      onClick={downloadSmsFileTemplate}
      data-testid="download-sms-file-template"
      sx={{mb: 1.5, alignSelf: "flex-start"}}
    >
      Télécharger le modèle de fichier
    </Button>
    <FileInput
      source="file"
      label="Fichier de destinataires (.csv, .xlsx)"
      accept=".csv,.xlsx"
      sx={{
        ...FILE_FIELD_STYLE,
        "height": "40vh",
        "& .RaFileInput-dropZone": {
          ...FILE_FIELD_STYLE["& .RaFileInput-dropZone"],
          height: "40vh",
        },
      }}
      validate={required()}
    >
      <FileField source="src" title="title" />
    </FileInput>
  </>
);

const SmsCampaignFormContent = ({source}: {source: SmsCampaignSource}) => (
  <>
    <MessageInput isRequired={source !== "file"} />
    {source === "groups" && <GroupsFields />}
    {source === "contacts" && <ContactsFields />}
    {source === "manual" && <ManualNumbersFields />}
    {source === "file" && <FileFields />}
  </>
);

export const SmsCampaignCreate = () => {
  const navigate = useNavigate();
  const {send, isLoading} = useSendSmsCampaign();
  const [source, setSource] = useState<SmsCampaignSource>("groups");

  const handleSubmit = async (values: FieldValues) => {
    switch (source) {
      case "groups": {
        const contactGroups: SmsContactGroup[] = values.contactGroups ?? [];
        await send({
          source,
          message: values.message,
          contactGroupIds: contactGroups.map((group) => group.id!),
        });
        return;
      }
      case "contacts": {
        const contacts: SmsContact[] = values.contacts ?? [];
        await send({
          source,
          message: values.message,
          contactIds: contacts.map((contact) => contact.id!),
        });
        return;
      }
      case "manual":
        await send({
          source,
          message: values.message,
          manualPhoneNumbers: values.manualPhoneNumbers ?? [],
        });
        return;
      case "file": {
        const file = extractFile(values.file);
        if (!file) return;
        await send({source, message: values.message || undefined, file});
      }
    }
  };

  return (
    <Box sx={{maxWidth: 1400, mx: "auto", p: 3}}>
      <Box sx={{display: "flex", alignItems: "center", gap: 1.5, mb: 3}}>
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
      <Paper variant="outlined" sx={{p: {xs: 2, md: 3}}}>
        <ToggleButtonGroup
          exclusive
          color="primary"
          value={source}
          onChange={(_event, value: SmsCampaignSource | null) =>
            value && setSource(value)
          }
          sx={{
            "mb": 3,
            "flexWrap": "wrap",
            "& .MuiToggleButton-root.Mui-selected": {
              backgroundColor: "rgba(40, 53, 147, 0.16)",
              borderColor: "rgba(40, 53, 147, 0.6)",
              color: "#1a2266",
              fontWeight: 600,
            },
            "& .MuiToggleButton-root.Mui-selected:hover": {
              backgroundColor: "rgba(40, 53, 147, 0.24)",
            },
          }}
        >
          {(Object.keys(SOURCE_LABEL) as SmsCampaignSource[]).map((key) => (
            <ToggleButton
              key={key}
              value={key}
              data-testid={`sms-source-${key}`}
            >
              {SOURCE_LABEL[key]}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <SimpleForm
          key={source}
          onSubmit={handleSubmit}
          defaultValues={{
            message: "",
            manualPhoneNumbers: [],
            contactGroups: [],
            contacts: [],
          }}
          toolbar={<SmsCampaignFormToolbar isLoading={isLoading} />}
          sx={{p: 0}}
        >
          <SmsCampaignFormContent source={source} />
        </SimpleForm>
      </Paper>
    </Box>
  );
};
