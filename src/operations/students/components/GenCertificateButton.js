import {Button} from "ra-ui-materialui";
import {Download as DownloadIcon} from "@mui/icons-material";
import {studenstFileApi} from "../../../providers/api";
import { useRef } from "react";

const FILE_NAME = "Certificat_Scolarité.pdf";

export function GenCertificateButton({studentId}) {
  const certificateLink = useRef(null)
  const notify = useNotifyMessage();

  const getScholarshipCertificate = () => {
    notify("Certificat de scolarité en cours de téléchargement", {
      autoHideDuration: 5000,
    });
    studenstFileApi()
      .getStudentScholarshipCertificate(studentId, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        certificateLink.current.href = window.URL.createObjectURL(
          new Blob([response.data], {type: "application/pdf"})
        );
        certificateLink.current.download = FILE_NAME;
        certificateLink.current.click();
      })
      .catch(() =>
        notify("Échec de téléchargement. Veuillez réessayer", {
          autoHideDuration: 5000,
        })
      );
  };

  return (
    <>
      <a ref={certificateLink} style={{display:'none'}} />
      <Button label="Certificat" onClick={getScholarshipCertificate}>
        <DownloadIcon />
      </Button>
    </>
  );
}
