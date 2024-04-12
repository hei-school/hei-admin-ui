import { useRef, useState } from "react";
import { CircularProgress } from "@mui/material";
import { useNotify } from "../../../hooks";
import { filesApi } from "../../../providers/api";
import { PALETTE_COLORS } from "../../../ui/constants/palette";

const FILE_NAME = "Certificat_Scolarité.pdf";

export function GetCertificate({ studentId }) {
  const [isLoading, setIsLoading] = useState(false);
  const certificateLink = useRef(null);
  const notify = useNotify();

  const getScholarshipCertificate = () => {
    setIsLoading(true);
    const certificateLinkRef = certificateLink.current;
    notify("Certificat de scolarité en cours de téléchargement", {
      autoHideDuration: 5000,
    });
    filesApi()
      .getStudentScholarshipCertificate(studentId, {
        responseType: "arraybuffer",
      })
      .then(({ data }) => {
        if (!data || data.byteLength <= 0) {
          notify("Échec de téléchargement. Veuillez réessayer", {
            type: "error",
          });
          return;
        }
        certificateLinkRef.href = window.URL.createObjectURL(
          new Blob([data], { type: "application/pdf" }),
        );
        certificateLinkRef.download = FILE_NAME;
        certificateLinkRef.click();
        setIsLoading(false);
      })
      .catch(() => {
        notify("Échec de téléchargement. Veuillez réessayer", {
          type: "error",
        });
        setIsLoading(false);
      });
  };

  return (
    <div style={{ padding: 0, margin: 0 }}>
      <a
        data-testid="certificate-link"
        ref={certificateLink}
        style={{ display: "none" }}
      />
      <a
        data-testid="get-certificat"
        aria-disabled={isLoading}
        onClick={getScholarshipCertificate}
      >
        {isLoading ? (
          <CircularProgress
            size={40}
            style={{ margin: "7px" }}
            sx={{
              ".MuiCircularProgress-circle": {
                color: PALETTE_COLORS.yellow,
              },
            }}
          />
        ) : (
          "Certificat"
        )}
      </a>
    </div>
  );
}
