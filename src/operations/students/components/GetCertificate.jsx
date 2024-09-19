import {FileDownloader} from "@/operations/common/components/FileDownloader";
import {filesApi} from "@/providers/api";

const FILE_NAME = "Certificat_Scolarité.pdf";

function GetCertificate({studentId}) {
  const downloadFunction = () =>
    filesApi().getStudentScholarshipCertificate(studentId, {
      responseType: "arraybuffer",
    });

  return (
    <FileDownloader
      downloadFunction={downloadFunction}
      fileName={FILE_NAME}
      buttonText="Certificat"
      successMessage="Certificat de scolarité en cours de téléchargement"
      errorMessage="Échec de téléchargement. Veuillez réessayer"
    />
  );
}

export default GetCertificate;
