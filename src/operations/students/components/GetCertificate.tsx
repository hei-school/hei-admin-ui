import {useNotify} from "@/hooks";
import {filesApi} from "@/providers/api";
import {Download} from "@mui/icons-material";
import {Button} from "@mui/material";
import {FC, useRef} from "react";
import {useRecordContext} from "react-admin";
import {isOver18} from "../utils/isOver18";

const FILE_NAME = "Certificat_Scolarité.pdf";
const requiredFields = {
  birth_date: "date de naissance",
  birth_place: "lieu de naissance",
  first_name: "prénom",
  last_name: "nom de famille",
  groups: "groupe",
};

export const GetCertificate: FC<{
  studentId: string;
  variant?: "text" | "outlined" | "contained";
}> = ({studentId, variant = "outlined"}) => {
  const notify = useNotify();
  const record = useRecordContext();
  const linkRef = useRef<HTMLAnchorElement | null>(null);

  const handleClick = async () => {
    const missingFields = record
      ? Object.entries(requiredFields)
          .filter(([key]) => !record[key as keyof typeof requiredFields])
          .map(([_, label]) => label)
      : [];

    if (missingFields.length > 0) {
      notify(
        `Vous ne pouvez pas télécharger votre certificat de scolarité car vos informations sont incomplètes : ${missingFields.join(
          ", "
        )}.`,
        {type: "warning"}
      );
      return;
    }

    if (isOver18(record?.birth_date) && !record?.nic) {
      notify(
        "Vous ne pouvez pas télécharger votre certificat de scolarité car vous êtes majeur et sans CIN.",
        {type: "warning"}
      );
      return;
    }

    try {
      notify("Certificat de scolarité en cours de téléchargement", {
        type: "info",
      });

      const response = await filesApi().getStudentScholarshipCertificate(
        studentId,
        {
          responseType: "arraybuffer",
        }
      );

      const blob = new Blob([response.data], {type: "application/pdf"});

      if (blob.size === 0) {
        notify("Échec de téléchargement. Veuillez réessayer", {type: "error"});
        return;
      }

      const url = window.URL.createObjectURL(blob);

      if (!linkRef.current) {
        linkRef.current = document.createElement("a");
        linkRef.current.dataset.testid = "file-link";
        document.body.appendChild(linkRef.current);
      }

      linkRef.current.href = url;
      linkRef.current.download = FILE_NAME;
      linkRef.current.click();

      notify("Certificat téléchargé avec succès !", {type: "success"});
    } catch (error) {
      notify("Échec du téléchargement du certificat de scolarité", {
        type: "error",
      });
    }
  };

  return (
    <>
      <Button
        variant={variant}
        startIcon={<Download sx={{fontSize: "1.5rem !important"}} />}
        onClick={handleClick}
        sx={{
          width: "100%",
          justifyContent: "flex-start",
          textTransform: "none",
          fontWeight: 500,
        }}
        color="inherit"
        data-testid="get-certificate-btn"
      >
        Certificat
      </Button>

      <a ref={linkRef} data-testid="file-link" style={{display: "none"}} />
    </>
  );
};
