import {Button} from "ra-ui-materialui";
import {Download as DownloadIcon} from "@mui/icons-material";
import {studenstFileApi} from "../../../providers/api";
import {useNotify} from "../../../hooks";
import {useRef} from "react";

const FILE_NAME = "Certificat_Scolarité.pdf";

export function GetCertificate({studentId}) {
  const certificateLink = useRef(null);
  const certificateLinkRef = certificateLink.current;

  const notify = useNotify();

  const getScholarshipCertificate = () => {
    notify("Certificat de scolarité en cours de téléchargement", {
      autoHideDuration: 5000,
    });
    studenstFileApi()
      .getStudentScholarshipCertificate(studentId, {
        responseType: "arraybuffer",
      })
      .then(({data}) => {
        if (!data || data.byteLength < 0) {
          notify("Échec de téléchargement. Veuillez réessayer", {
            type: "error",
          });
        }
        console.log(data.byteLength);
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
    <>
      <a ref={certificateLink} style={{display: "none"}} />
      <Button label="Certificat" onClick={getScholarshipCertificate}>
        <DownloadIcon />
      </Button>
    </>
  );
}
