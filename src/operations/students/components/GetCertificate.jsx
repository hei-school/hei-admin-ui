import {Button} from "react-admin";
import {Download} from "@mui/icons-material";
import {FileDownloader} from "@/operations/common/components";
import {filesApi} from "@/providers/api";

const FILE_NAME = "Certificat_Scolarité.pdf";

export const GetCertificate = ({studentId, variant = " "}) => {
  const downloadFunction = () =>
    filesApi().getStudentScholarshipCertificate(studentId, {
      responseType: "arraybuffer",
    });

  return (
    <FileDownloader
      fileName={FILE_NAME}
      buttonText="Certification"
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
