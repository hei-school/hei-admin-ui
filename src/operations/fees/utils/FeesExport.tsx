import {PALETTE_COLORS} from "@/haTheme";
import {FileDownloader} from "@/operations/common/components";
import dataProvider from "@/providers/dataProvider";
import {Dialog} from "@/ui/components";
import {mapToChoices} from "@/utils";
import {NOOP_ID} from "@/utils/constants";
import {toUTC} from "@/utils/date";
import {Download} from "@mui/icons-material";
import {Box, TextField} from "@mui/material";
import {FC, useEffect, useState} from "react";
import {required, SelectInput, SimpleForm} from "react-admin";
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
        id: NOOP_ID,
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

const MonthRangeInputs = () => {
  const {setValue, watch} = useFormContext();
  const [selectedMonth, setSelectedMonth] = useState("");

  const monthFrom = watch("monthFrom");
  const monthTo = watch("monthTo");

  useEffect(() => {
    if (monthFrom && !selectedMonth) {
      const date = new Date(monthFrom);
      setSelectedMonth(
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      );
    }
  }, [monthFrom, selectedMonth]);

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedMonth(value);
    if (value) {
      const [year, month] = value.split("-").map(Number);
      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0);
      setValue("monthFrom", firstDay.toISOString(), {shouldValidate: true});
      setValue("monthTo", lastDay.toISOString(), {shouldValidate: true});
    } else {
      setValue("monthFrom", "", {shouldValidate: true});
      setValue("monthTo", "", {shouldValidate: true});
    }
  };

  return (
    <Box width="100%" display="flex" gap="2vw">
      <TextField
        label="Mois"
        type="month"
        value={selectedMonth}
        onChange={handleMonthChange}
        sx={{flex: 1}}
        inputProps={{min: "2000-01", max: "2100-12"}}
      />
      <TextField
        label="Date de début"
        value={monthFrom ? new Date(monthFrom).toLocaleDateString("fr-FR") : ""}
        sx={{flex: 1}}
        disabled
      />
      <TextField
        label="Date de fin"
        value={monthTo ? new Date(monthTo).toLocaleDateString("fr-FR") : ""}
        sx={{flex: 1}}
        disabled
      />
    </Box>
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
        <MonthRangeInputs />
      </SimpleForm>
    </Dialog>
  );
};
