import ExcelIcon from "@/assets/xls.png";
import {useToggle} from "@/hooks";
import {FileUploadDialog} from "@/operations/common/components/FileUploadDialog";
import {Upload} from "@mui/icons-material";
import {Button} from "@mui/material";
import {FC, useMemo, useState} from "react";
import {DateInput} from "react-admin";
import * as XLSX from "xlsx";

export const NewImportButton: FC = () => {
  const [isOpen, , toggle] = useToggle();
  const [parsedRows, setParsedRows] = useState<any[] | null>(null);

  const EXPECTED_HEADERS = useMemo(
    () => [
      "ref",
      "first_name",
      "last_name",
      "email",
      "sex",
      "birth_date",
      "address",
      "phone",
      "entrance_datetime",
      "payment_frequency",
    ],
    []
  );

  const validateExcelFile = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, {type: "array"});
      const firstSheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[firstSheetName];
      const rows: any[][] = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: "",
      });

      const headerRow: string[] = (rows[0] || []).map((h) => String(h).trim());
      const lowerFound = headerRow.map((h) => h.toLowerCase());
      const lowerExpected = EXPECTED_HEADERS.map((h) => h.toLowerCase());
      const missing = lowerExpected.filter((exp) => !lowerFound.includes(exp));

      if (missing.length > 0) {
        return {
          isValid: false,
          errorMessage:
            `En-têtes manquants : ${missing.join(", ")}. ` +
            "Veuillez utiliser le modèle dans template",
        };
      }

      const dataRows = rows.slice(1);
      const MAX_ROWS = 50;
      if (dataRows.length > MAX_ROWS) {
        return {
          isValid: false,
          errorMessage: `Le fichier contient plus de ${MAX_ROWS} entrées. Réduisez à ${MAX_ROWS} maximum.`,
        };
      }

      const json = XLSX.utils.sheet_to_json(sheet, {defval: ""});
      setParsedRows(json);

      return {
        isValid: true,
        additionalInfo: {rowsCount: json.length},
      };
    } catch (err) {
      return {
        isValid: false,
        errorMessage: "Erreur lors de la lecture du fichier",
      };
    }
  };

  return (
    <>
      <Button
        data-testid="import-students-button"
        startIcon={<Upload />}
        sx={{
          width: "100%",
          justifyContent: "start",
          paddingLeft: "20px",
          paddingTop: "7px",
          paddingBottom: "7px",
          color: "#474645",
          textTransform: "none",
        }}
        onClick={toggle}
      >
        Importer
      </Button>

      <FileUploadDialog
        isOpen={isOpen}
        onClose={toggle}
        title="Importer les étudiants"
        resource="import-students"
        accept=".xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        fileIcon={ExcelIcon}
        fileIconAlt="Excel"
        saveButtonLabel="Lancer l'import"
        confirmContent="Êtes-vous certain de vouloir lancer l'import avec le fichier sélectionné ?"
        validateFile={validateExcelFile}
        meta={{rows: parsedRows}}
      >
        <DateInput
          data-testid="due-datetime-input"
          source="due_datetime"
          label="Date d'échéance"
          sx={{width: "100%"}}
          required
        />
      </FileUploadDialog>
    </>
  );
};
