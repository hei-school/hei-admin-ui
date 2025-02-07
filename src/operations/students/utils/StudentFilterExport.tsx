import {FC} from "react";
import {required, SelectInput, SimpleForm} from "react-admin";
import {useFormContext} from "react-hook-form";

import {Download} from "@mui/icons-material";

import {PALETTE_COLORS} from "@/haTheme";
import {FileDownloader} from "@/operations/common/components";
import {WORK_STATUS_VALUE} from "@/operations/docs/components/SelectWorkStatus";
import dataProvider from "@/providers/dataProvider";
import {Dialog} from "@/ui/components";
import {mapToChoices} from "@/utils";

import {GENDER_OPTIONS, USERS_STATUS} from "../constants";

const FileDownloaderWrapper = () => {
  const {watch} = useFormContext();
  const {status, sex, work_study_status} = watch();

  const downloadFile = async () => {
    try {
      const {
        data: {file},
      } = await dataProvider.getOne("students-export", {
        meta: {
          status: status,
          sex: sex,
          workStudyStatus: work_study_status,
        },
      });
      return {data: file};
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FileDownloader
      downloadFunction={downloadFile}
      sx={{
        "padding": "1vh 3vw",
        "backgroundColor": PALETTE_COLORS.primary,
        "color": "white",
        "&:hover": {
          backgroundColor: PALETTE_COLORS.primary,
          color: "white",
        },
        "marginLeft": "1vw",
        "marginBottom": "1vh",
      }}
      startIcon={<Download />}
      fileName={`Listes des étudiants qui ${(WORK_STATUS_VALUE[work_study_status as keyof typeof WORK_STATUS_VALUE] as string) ?? "est actif"} `}
      buttonText="Exporter"
      successMessage="Exportation en cours…"
      errorMessage="Une erreur est survenue lors de l'exportation du fichier."
      fileType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    />
  );
};

export const StudentFilterExport: FC<{onClose: () => void; open: boolean}> = ({
  onClose,
  open,
}) => {
  return (
    <Dialog
      title="Exporter les étudiants au format XLSX"
      onClose={onClose}
      open={open}
    >
      <SimpleForm toolbar={<FileDownloaderWrapper />}>
        <SelectInput
          fullWidth
          label="Statut de l'étudiant"
          source="status"
          optionText="label"
          optionValue="value"
          defaultValue={"ENABLED"}
          choices={mapToChoices(USERS_STATUS)}
          validate={required()}
        />
        <SelectInput
          fullWidth
          label="Sexe de l'étudiant"
          source="sex"
          optionText="label"
          optionValue="value"
          choices={mapToChoices(GENDER_OPTIONS)}
        />
        <SelectInput
          fullWidth
          label="Statut de travail et d'études"
          source="work_study_status"
          optionText="label"
          optionValue="value"
          choices={mapToChoices(WORK_STATUS_VALUE)}
        />
      </SimpleForm>
    </Dialog>
  );
};
