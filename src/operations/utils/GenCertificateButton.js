import {useNotify} from "ra-core";
import {studenstFileApi} from "../../providers/api";
import {Download} from "@mui/icons-material";
import {Button} from "ra-ui-materialui";
import {useCallback} from "react";

export function GenCertificateButton({studentId}) {
  const notify = useNotify();
  const FILE_NAME = "Certificat_Scolarité.pdf";

  const generate = useCallback(() => {
    notify("Certificat de scolarité en cours de téléchargement", {
      autoHideDuration: 5000,
    });
    studenstFileApi()
      .getStudentScholarshipCertificate(studentId, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(
          new Blob([response.data], {type: "application/pdf"})
        );
        link.download = FILE_NAME;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(() =>
        notify("Échec de téléchargement. Veuillez réessayer", {
          autoHideDuration: 5000,
        })
      );
  }, [studentId]);

  return (
    <Button label="Certificat" onClick={generate}>
      <Download />
    </Button>
  );
}
