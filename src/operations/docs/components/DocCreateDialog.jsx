import {
  DateInput,
  FileField,
  FileInput,
  SimpleForm,
  TextInput,
  regex,
} from "react-admin";
import {Dialog, DialogTitle, Box} from "@mui/material";
import {FileType} from "@haapi/typescript-client";
import {Create} from "@/operations/common/components";
import {removeExtension} from "@/utils/files";
import {PALETTE_COLORS} from "@/haTheme";
import {useNotify} from "@/hooks";
import {OwnerType} from "../types";
import {SelectWorkType} from "./SelectWorkType";

const DOCUMENT_FILENAME_PATTERN = /^[^.]*$/;

const getTitle = (owner, type) => {
  if (owner === OwnerType.SCHOOL) {
    return "document de HEI";
  }

  if (owner === OwnerType.STUDENT) {
    switch (type) {
      case FileType.TRANSCRIPT:
        return "bulletin";
      case FileType.OTHER:
        return "document étudiant";
      case FileType.WORK_DOCUMENT:
        return "document de validations d'expériences professionnelles";
      default:
        return "document";
    }
  }
  return "document";
};

const transformDoc = (doc, type, owner, userId) => {
  if (!doc) return null;
  doc.title = doc.name || removeExtension(doc.raw?.title);

  if (type === FileType.WORK_DOCUMENT) {
    doc.commitment_begin_date = new Date(
      doc.commitment_begin_date
    ).toISOString();
    doc.commitment_end_date &&
      (doc.commitment_end_date = new Date(
        doc.commitment_end_date
      ).toISOString());
  }

  return {
    type,
    userId,
    owner,
    ...doc,
  };
};

export const DocCreateDialog = ({
  type,
  userId,
  owner,
  isOpen,
  toggle,
  refresh,
}) => {
  const notify = useNotify();

  return (
    <Dialog open={isOpen} onClose={toggle}>
      <DialogTitle
        color={PALETTE_COLORS.white}
        sx={{bgcolor: PALETTE_COLORS.primary}}
        fontWeight="bold"
      >
        Ajouter un {getTitle(owner, type)}
      </DialogTitle>
      <Create
        title=" "
        redirect={false}
        resource="docs"
        transform={(doc) => transformDoc(doc, type, owner, userId)}
        mutationOptions={{
          onSuccess: () => {
            toggle();
            notify("Document créé.", {type: "success"});
            refresh();
          },
        }}
      >
        <SimpleForm>
          <TextInput
            source="name"
            label="Titre du document (optionnel)"
            validate={[
              regex(
                DOCUMENT_FILENAME_PATTERN,
                "Le nom du fichier ne doit pas contenir de point."
              ),
            ]}
            fullWidth
          />
          {type === FileType.WORK_DOCUMENT && (
            <Box>
              <SelectWorkType />
              <DateInput
                source="commitment_begin_date"
                label="Date du début de l'expérience professionnelle"
                required
                fullWidth
              />
              <DateInput
                source="commitment_end_date"
                label="Date du fin de l'expérience professionnelle"
                fullWidth
              />
            </Box>
          )}
          <FileInput
            isRequired
            source="raw"
            label=" "
            multiple={false}
            accept="application/pdf"
            sx={{cursor: "pointer", border: `1px solid ${PALETTE_COLORS.grey}`}}
          >
            <FileField source="src" title="title" />
          </FileInput>
        </SimpleForm>
      </Create>
    </Dialog>
  );
};
