import {
  DateInput,
  FileField,
  FileInput,
  SelectInput,
  SimpleForm,
  TextInput,
  regex,
} from "react-admin";
import {Dialog, DialogTitle, Box} from "@mui/material";
import {useParams} from "react-router-dom";
import {FileType} from "@haapi/typescript-client";
import {Create} from "@/operations/common/components";
import {useRole} from "@/security/hooks/useRole";
import {removeExtension} from "@/utils/files";
import {PALETTE_COLORS} from "@/haTheme";
import {useNotify} from "@/hooks";
import {OwnerType} from "../types";
import authProvider from "@/providers/authProvider";
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
        return "document d'autorisation en alternance";
      default:
        return "document";
    }
  }
  return "document";
};

const transformDoc = (doc, type, owner, studentId) => {
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
    studentId,
    owner,
    ...doc,
  };
};

export const DocCreateDialog = ({type, owner, isOpen, toggle, refresh}) => {
  const params = useParams();
  const {isStudent} = useRole();
  const notify = useNotify();

  const studentId = isStudent()
    ? authProvider.getCachedWhoami().id
    : params.studentId;

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
        transform={(doc) => transformDoc(doc, type, owner, studentId)}
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
