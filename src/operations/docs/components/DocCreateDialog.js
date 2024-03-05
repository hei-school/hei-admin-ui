import {FileField, FileInput, SimpleForm, regex} from "react-admin";
import {Dialog, DialogTitle} from "@mui/material";
import {useParams} from "react-router-dom";
import {FileType} from "@haapi/typescript-client";
import {CustomCreate} from "../../utils/CustomCreate";
import {useRole} from "../../../security/hooks/useRole";
import {removeExtension} from "../../../utils/removeExtension";
import {PALETTE_COLORS} from "../../../ui/constants/palette";
import {OwnerType} from "../types";
import authProvider from "../../../providers/authProvider";

const FILENAME_REGEX = /^[^\s.]+$/;

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
        return "";
    }
  }
  return "";
};

const transformDoc = (raw, type, owner, studentId) => {
  if (!raw) return null;
  return {
    type,
    studentId,
    owner,
    ...raw,
  };
};

export const DocCreateDialog = ({type, owner, isOpen, toggle}) => {
  const params = useParams();
  const {isStudent} = useRole();

  const studentId = isStudent()
    ? authProvider.getCachedWhoami().id
    : params.studentId;

  const validateFile = (value, _allValues) => {
    if (!value) {
      return "Ce champ est obligatoire.";
    }
    if (!FILENAME_REGEX.test(removeExtension(value.title))) {
      return "Le nom du fichier ne doit pas contenir de point ni de caractère spécial ni d'espace.";
    }
    return undefined;
  };

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
          onSuccess: () => {
            toggle();
          },
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
