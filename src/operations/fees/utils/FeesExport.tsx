import {PALETTE_COLORS} from "@/haTheme";
import {FileDownloader} from "@/operations/common/components";
import dataProvider from "@/providers/dataProvider";
import {Dialog} from "@/ui/components";
import {mapToChoices} from "@/utils";
import {NOOP_ID} from "@/utils/constants";
import {toUTC} from "@/utils/date";
import {AdvancedFeeStatisticsType} from "@haapi-b0fc7615/typescript-client/dist/api";
import {Download} from "@mui/icons-material";
import {Box, TextField} from "@mui/material";
import {FC, useEffect, useState} from "react";
import {required, SelectInput, SimpleForm} from "react-admin";
import {useFormContext, useWatch} from "react-hook-form";
import {FEE_STATUS, FEE_STATUS_CHOICES} from "../constants";

type FileDownloaderWrapperProps = {
  onClose: () => void;
};

export const FileDownloaderWrapper: FC<FileDownloaderWrapperProps> = ({
  onClose,
}) => {
  const {watch} = useFormContext();
  const {monthFrom, monthTo, status, type} = watch();

  const downloadFile = async () => {
    try {
      const {
        data: {file},
      } = await dataProvider.getOne("fees-export", {
        id: NOOP_ID,
        meta: {
          status,
          type,
          fromDueDatetime: monthFrom
            ? toUTC(new Date(monthFrom)).toISOString()
            : null,
          toDueDatetime: monthTo
            ? toUTC(new Date(monthTo)).toISOString()
            : null,
        },
      });
      onClose();
      return {data: file};
    } catch (error) {
      throw new Error(
        "Une erreur est survenue lors de l'exportation du fichier."
      );
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
      fileName={`Liste frais ${FEE_STATUS[status as keyof typeof FEE_STATUS] as string}_${monthFrom ? new Date(monthFrom).toLocaleDateString("fr-FR", {month: "2-digit", year: "numeric"}) : "toutes périodes"}.xlsx`}
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

  const handleMonthToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const date = new Date(value);
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
      setValue("monthTo", date.toISOString(), {shouldValidate: true});
    } else {
      setValue("monthTo", "", {shouldValidate: true});
    }
  };

  const monthToDateValue = monthTo
    ? new Date(monthTo).toISOString().split("T")[0]
    : "";

  const monthFromDateValue = monthFrom
    ? new Date(monthFrom).toISOString().split("T")[0]
    : "";

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
      />
      <TextField
        label="Date de fin"
        type="date"
        value={monthToDateValue}
        onChange={handleMonthToChange}
        sx={{flex: 1}}
        required
        inputProps={{
          min: monthFromDateValue,
        }}
      />
    </Box>
  );
};

const ConditionalStatisticsTypeInput = () => {
  const {control} = useFormContext();
  const status = useWatch({name: "status", control});

  if (status !== "ALL") return null;

  return (
    <SelectInput
      fullWidth
      label="Type de statistiques"
      source="type"
      optionText="label"
      optionValue="value"
      defaultValue={AdvancedFeeStatisticsType.ACCOUNTING}
      choices={mapToChoices(AdvancedFeeStatisticsType)}
      emptyText={"--Sélectionnez un type--"}
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
      <SimpleForm toolbar={<FileDownloaderWrapper onClose={onClose} />}>
        <SelectInput
          fullWidth
          label="Statut des frais"
          source="status"
          choices={FEE_STATUS_CHOICES}
          optionValue="id"
          optionText="name"
          defaultValue="LATE"
          validate={required()}
        />
        <ConditionalStatisticsTypeInput />
        <MonthRangeInputs />
      </SimpleForm>
    </Dialog>
  );
};
