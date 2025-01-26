import {Button, useRecordContext} from "react-admin";
import {Download} from "@mui/icons-material";
import {FileDownloader} from "@/operations/common/components";
import {useNotify} from "@/hooks";
import {filesApi} from "@/providers/api";
import {isOver18} from "../utils/isOver18";

const FILE_NAME = "Certificat_Scolarité.pdf";
const requiredFields = {
  birth_date: "date de naissance",
  birth_place: "lieu de naissance",
  first_name: "prénom",
  last_name: "nom de famille",
  groups: "groupe",
};

export const GetCertificate = ({studentId, variant = " "}) => {
  const notify = useNotify();
  const record = useRecordContext();

  const downloadFunction = () => {
    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => !record[key])
      .map(([_, value]) => value);

    if (missingFields.length > 0) {
      notify(
        `Vous ne pouvez pas télécharger votre certificat de scolarité car vos informations sont incomplètes : ${missingFields.join(", ")}.`,
        {type: "error"}
      );
      return;
    }
    if (isOver18(record?.birth_date) && !nic) {
      notify(
        "Vous ne pouvez pas télécharger votre certificat de scolarité car vous êtes majeur et sans CIN.",
        {type: "error"}
      );
      return;
    }
    return filesApi().getStudentScholarshipCertificate(studentId, {
      responseType: "arraybuffer",
    });
  };

  return (
    <FileDownloader
      fileName={FILE_NAME}
      buttonText="Certificat"
      startIcon={
        <Download
          sx={{
            fontSize: "1.5rem !important",
          }}
        />
      }
      variant={variant}
      data-testid="get-certificate-btn"
      downloadFunction={downloadFunction}
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-start",
        textTransform: "none",
        fontWeight: "500",
      }}
      color="inherit"
      errorMessage="Échec de téléchargement. Veuillez réessayer"
      successMessage="Certificat de scolarité en cours de téléchargement"
    />
  );
};
