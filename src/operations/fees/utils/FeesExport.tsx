import {PALETTE_COLORS} from "@/haTheme";
import {FileDownloader} from "@/operations/common/components";
import dataProvider from "@/providers/dataProvider";
import {Dialog} from "@/ui/components";
import {mapToChoices} from "@/utils";
import {toUTC} from "@/utils/date";
import {Download} from "@mui/icons-material";
import {Box} from "@mui/material";
import {FC} from "react";
import {DateInput, required, SelectInput, SimpleForm} from "react-admin";
import {useFormContext} from "react-hook-form";
import {FEE_STATUS} from "../constants";

export const FileDownloaderWrapper = () => {
  const {watch} = useFormContext();
  const {monthFrom, monthTo, status} = watch();

  const downloadFile = async () => {
    try {
      const {
        data: {file},
      } = await dataProvider.getOne("fees-export", {
        meta: {
          status: status,
          fromDueDatetime: monthFrom
            ? toUTC(new Date(monthFrom)).toISOString()
            : null,
          toDueDatetime: monthTo
            ? toUTC(new Date(monthTo)).toISOString()
            : null,
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
      fileName={`Liste frais ${FEE_STATUS[status as keyof typeof FEE_STATUS] as string}`}
      buttonText="Exporter"
      successMessage="Exportation en cours…"
      errorMessage="Une erreur est survenue lors de l'exportation du fichier."
      fileType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    />
  );
};
export const FeesExport: FC<{onClose: () => void; open: boolean}> = ({
  onClose,
  open,
}) => {
  return (
    <Dialog
      title="Exporter les frais au format XLSX"
      onClose={onClose}
      open={open}
    >
      <SimpleForm toolbar={<FileDownloaderWrapper />}>
        <SelectInput
          fullWidth
          label="Statut des frais"
          source="status"
          optionText="label"
          optionValue="value"
          defaultValue={FEE_STATUS.LATE}
          choices={mapToChoices(FEE_STATUS)}
          validate={required()}
        />
        <Box width="100%" display="flex" gap="2vw">
          <DateInput
            source="monthFrom"
            sx={{
              flex: 1,
            }}
            label="Date de début"
          />
          <DateInput
            source="monthTo"
            sx={{
              flex: 1,
            }}
            label="Date de fin"
          />
        </Box>
      </SimpleForm>
    </Dialog>
  );
};
