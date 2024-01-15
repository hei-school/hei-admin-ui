import {Button} from "ra-ui-materialui";
import {Download as DownloadIcon} from "@mui/icons-material";
import {studenstFileApi} from "../../../providers/api";
import {useNotify} from "../../../hooks";
import {useRef} from "react";

const FILE_NAME = "Certificat_Scolarité.pdf";

export function GetCertificate({studentId}) {
  const certificateLink = useRef(null);

  const notify = useNotify();

  const getScholarshipCertificate = () => {
    const certificateLinkRef = certificateLink.current;
    notify("Certificat de scolarité en cours de téléchargement", {
      autoHideDuration: 5000,
    });
    studenstFileApi()
      .getStudentScholarshipCertificate(studentId, {
        responseType: "arraybuffer",
      })
      .then(({data}) => {
        if (!data || data.byteLength <= 0) {
          notify("Échec de téléchargement. Veuillez réessayer", {
            type: "error",
          });
          return;
        }
        certificateLinkRef.href = window.URL.createObjectURL(
          new Blob([data], {type: "application/pdf"})
        );
        certificateLinkRef.download = FILE_NAME;
        certificateLinkRef.click();
      })
      .catch(() => {
        notify("Échec de téléchargement. Veuillez réessayer", {type: "error"});
      });
  };

  return (
    <div style={{padding: 0, margin: 0}}>
      <a ref={certificateLink} style={{display: "none"}} />
      <Button data-testid="get-certificate-btn" label="Certificat" onClick={getScholarshipCertificate}>
        <DownloadIcon />
      </Button>
    </div>
  );
}
