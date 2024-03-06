import {FileField, FileInput, SimpleForm} from "react-admin";
import {Dialog, DialogTitle} from "@mui/material";
import {useParams} from "react-router-dom";
import {FileType} from "@haapi/typescript-client";
import {CustomCreate} from "../../utils/CustomCreate";
import {useRole} from "../../../security/hooks/useRole";
import {removeExtension} from "../../../utils/files";
import {PALETTE_COLORS} from "../../../ui/constants/palette";
import {OwnerType} from "../types";
import authProvider from "../../../providers/authProvider";

const DOCUMENT_FILENAME_PATTERN = /^[^\s.]+$/;

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
      default:
        return "document";
    }
  }
  return "document";
};

const transformDoc = (raw, type, owner, studentId) => {
  if (!raw) return null;

  raw.raw.title = removeExtension(raw.raw.title);

  return {
    type,
    studentId,
    owner,
    ...raw,
  };
};

const validateFile = (value) => {
  if (!value) {
    return "Ce champ est obligatoire.";
  }
  if (!DOCUMENT_FILENAME_PATTERN.test(removeExtension(value.title))) {
    return "Le nom du fichier ne doit pas contenir de point ni de caractère spécial ni d'espace.";
  }
  return undefined;
};

export const DocCreateDialog = ({type, owner, isOpen, toggle}) => {
  const params = useParams();
  const {isStudent} = useRole();

  const studentId = isStudent()
    ? authProvider.getCachedWhoami().id
    : params.studentId;

  return (
    <Dialog open={isOpen} onClose={toggle}>
      <DialogTitle color={PALETTE_COLORS.yellow} fontWeight="bold">
        Ajouter un {getTitle(owner, type)}
      </DialogTitle>
      <CustomCreate
        title=" "
        redirect={false}
        resource="docs"
        transform={(doc) => transformDoc(doc, type, owner, studentId)}
        mutationOptions={{
          onSuccess: toggle,
        }}
      >
        <SimpleForm>
          <FileInput
            source="raw"
            label=" "
            multiple={false}
            accept="application/pdf,image/jpeg,image/png,image/webp"
            validate={[validateFile]}
          >
            <FileField source="src" title="title" />
          </FileInput>
        </SimpleForm>
      </CustomCreate>
    </Dialog>
  );
};
