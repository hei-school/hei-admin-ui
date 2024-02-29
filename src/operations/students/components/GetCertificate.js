import {useRef} from "react";
import {useNotify} from "../../../hooks";
import {filesApi} from "../../../providers/api";
import authProvider from "../../../providers/authProvider";

const FILE_NAME = "Certificat_Scolarité.pdf";

export function GetCertificate({studentId}) {
  const certificateLink = useRef(null);
  const notify = useNotify();
  const id = authProvider.getCachedWhoami().id;

  const getScholarshipCertificate = () => {
    const certificateLinkRef = certificateLink.current;
    notify("Certificat de scolarité en cours de téléchargement", {
      autoHideDuration: 5000,
    });
    filesApi()
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
      .catch((e) => {
        notify("Échec de téléchargement. Veuillez réessayer", {type: "error"});
        console.log("CATCH");
        console.error(e);
      });
  };

  return (
    <div style={{padding: 0, margin: 0}}>
      <a
        data-testid="certificate-link"
        ref={certificateLink}
        style={{display: "none"}}
      />
      <a
        data-testid="get-certificate-btn"
        onClick={getScholarshipCertificate}
        label="Certificat"
      >
        Certificat
      </a>
    </div>
  );
}
