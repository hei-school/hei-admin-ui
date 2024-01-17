import {useRef} from "react";
import {Button} from "react-admin";
import {Download as DownloadIcon} from "@mui/icons-material";

import {useNotify} from "../../../hooks";
import {studenstFileApi} from "../../../providers/api";
import {BUTTON_PROPS} from "../../common/constants/button_props";

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
      <a
        data-testid="certificate-link"
        ref={certificateLink}
        style={{display: "none"}}
      />
      <Button
        data-testid="get-certificate-btn"
        onClick={getScholarshipCertificate}
        label="Certificat"
        {...BUTTON_PROPS}
      >
        <DownloadIcon />
      </Button>
    </div>
  );
}
