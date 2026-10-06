import uploadImg from "@/assets/file_upload.png"; // Assurez-vous que ce fichier existe
import XlsIcon from "@/assets/xls.png";
import {PALETTE_COLORS} from "@/haTheme";
import {useNotify} from "@/hooks";
import {Dialog} from "@/ui/components";
import {
  AttendanceStatus,
  EventParticipant,
} from "@haapi-b0fc7615/typescript-client";
import {Box, Button, Typography} from "@mui/material";
import {useState} from "react";
import {FileInput, SimpleForm, Toolbar, useUpdate} from "react-admin";
import * as XLSX from "xlsx";

interface ImportStatusDialogProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
  participants: EventParticipant[];
  onSuccess?: () => void;
}

const FILE_FIELD_STYLE = {
  "border": "1px dashed",
  "borderColor": PALETTE_COLORS.grey,
  "borderRadius": "8px",
  "backgroundColor": PALETTE_COLORS.lightgrey,
  "height": "14vh",
  "backgroundImage": `url(${uploadImg})`,
  "backgroundRepeat": "no-repeat",
  "backgroundPosition": "center",
  "backgroundPositionY": "1.5vh",
  "backgroundSize": "20%",
  "position": "relative",
  "& .RaFileInput-dropZone": {
    backgroundColor: "transparent",
    position: "absolute",
    bottom: "0",
    width: "97%",
    cursor: "pointer",
    height: "14vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "end",
  },
};

type ImportedRow = Record<string, unknown>;

type StatusRow = {
  status?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
};

type StatusUpdate = Pick<EventParticipant, "id" | "event_status">;

const asText = (value: unknown): string | undefined =>
  typeof value === "string" ? value : undefined;

const toStatusRow = (row: ImportedRow): StatusRow => ({
  status: asText(row.status),
  email: asText(row.email),
  firstname: asText(row.firstname),
  lastname: asText(row.lastname),
});

const normalizeHeader = (header: string): string => {
  return header.replace(/^participant\./, "").toLowerCase();
};

const toRow = (headers: string[], values: unknown[]): ImportedRow => {
  const row: ImportedRow = {};
  headers.forEach((header, index) => {
    row[header] = values[index];
  });
  return row;
};

const parseCsv = (text: string): ImportedRow[] => {
  const lines = text.split("\n").filter((line) => line.trim() !== "");
  const headers = lines[0]
    .split(",")
    .map((header) => normalizeHeader(header.trim()));
  return lines.slice(1).map((line) =>
    toRow(
      headers,
      line.split(",").map((value) => value.trim())
    )
  );
};

const parseWorkbook = (data: ArrayBuffer): ImportedRow[] => {
  const workbook = XLSX.read(data, {type: "array"});
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(sheet, {header: 1}) as unknown[][];
  const headers = jsonData[0].map((header) =>
    normalizeHeader(header as string)
  );
  return jsonData.slice(1).map((row) => toRow(headers, row));
};

const parseFile = async (file: File): Promise<ImportedRow[]> => {
  if (file.type.includes("csv")) {
    return parseCsv(await file.text());
  }
  return parseWorkbook(await file.arrayBuffer());
};

export const ImportStatusDialog = ({
  open,
  onClose,
  eventId,
  participants,
  onSuccess,
}: ImportStatusDialogProps) => {
  const notify = useNotify();
  const [updateStatus, {isLoading}] = useUpdate();
  const [file, setFile] = useState<File | null>(null);
  const [fileInfo, setFileInfo] = useState<{name: string; size: number} | null>(
    null
  );

  const minimalHeaders = ["status"];

  const validateData = (
    data: ImportedRow[]
  ): {isValid: boolean; message: string} => {
    if (!data || data.length === 0) {
      return {isValid: false, message: "Le fichier est vide."};
    }

    const headers = Object.keys(data[0] || {});
    const missingHeaders = minimalHeaders.filter(
      (header) => !headers.includes(header.toLowerCase())
    );
    if (missingHeaders.length > 0) {
      return {
        isValid: false,
        message: `Les colonnes suivantes sont obligatoires : ${missingHeaders.join(", ")}`,
      };
    }

    const validStatuses = ["PRESENT", "MISSING", "LATE", "EXCUSED"];
    for (let i = 0; i < data.length; i++) {
      const row = toStatusRow(data[i]);
      const rowNumber = i + 1;

      if (!row.status || !validStatuses.includes(row.status.toUpperCase())) {
        return {
          isValid: false,
          message: `Le statut "${row.status}" à la ligne ${rowNumber} n'est pas valide. Les statuts valides sont : ${validStatuses.join(", ")}`,
        };
      }

      if (!row.email && !(row.firstname && row.lastname)) {
        return {
          isValid: false,
          message: `Aucune information d'identification (email, ou firstName/lastName) trouvée à la ligne ${rowNumber}`,
        };
      }
    }

    return {isValid: true, message: "Données valides"};
  };

  const transformData = (data: ImportedRow[]): StatusUpdate[] => {
    return data.map(toStatusRow).map((row) => {
      let participant: EventParticipant | undefined;
      const {email, firstname, lastname} = row;
      if (email) {
        participant = participants.find(
          (p) => p.email?.toLowerCase() === email.toLowerCase()
        );
      }
      if (!participant && firstname && lastname) {
        participant = participants.find(
          (p) =>
            p.first_name?.toLowerCase() === firstname.toLowerCase() &&
            p.last_name?.toLowerCase() === lastname.toLowerCase()
        );
      }

      if (!participant) {
        throw new Error(
          `Participant non trouvé pour la ligne avec email=${row.email}, ou firstName=${row.firstname}/lastName=${row.lastname}`
        );
      }

      return {
        id: participant.id,
        event_status: (row.status ?? "").toUpperCase() as AttendanceStatus,
      };
    });
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      setFile(file);
      setFileInfo({
        name: file.name,
        size: file.size,
      });
    } else {
      setFile(null);
      setFileInfo(null);
    }
  };

  const handleImport = async () => {
    if (!file) {
      notify("Veuillez sélectionner un fichier.", {type: "warning"});
      return;
    }

    try {
      const data = await parseFile(file);
      const validation = validateData(data);
      if (!validation.isValid) {
        notify(validation.message, {type: "error"});
        return;
      }

      const transformedData = transformData(data);
      await updateStatus(
        "event-participants",
        {data: transformedData, meta: {eventId}},
        {
          onSuccess: () => {
            notify("Mise à jour des statuts réussie.", {type: "success"});
            setFile(null);
            setFileInfo(null);
            if (onSuccess) onSuccess();
            onClose();
          },
          onError: () =>
            notify("Erreur lors de la mise à jour des statuts.", {
              type: "error",
            }),
        }
      );
    } catch {
      notify("Erreur lors de l'importation du fichier.", {type: "error"});
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Ko";
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${Math.round(kb)} Ko`;
    }
    return `${(kb / 1024).toFixed(2)} Mo`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      title="Importer des présences"
    >
      <SimpleForm
        toolbar={
          <CustomToolbar
            file={file!}
            handleImport={handleImport}
            isLoading={isLoading}
            onClose={onClose}
          />
        }
      >
        <FileInput
          source="file"
          label=" "
          multiple={false}
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          sx={FILE_FIELD_STYLE}
          onChange={handleFileChange}
          placeholder={
            <Typography>Sélectionner un fichier (CSV ou Excel)</Typography>
          }
        />
        {fileInfo && (
          <Box
            sx={{
              mt: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              paddingBlock: "8px",
              paddingLeft: "6px",
              backgroundColor: PALETTE_COLORS.lightgrey,
              borderRadius: "4px",
              width: "100%",
            }}
          >
            <img
              src={XlsIcon}
              alt="xls"
              style={{
                height: "40px",
                width: "40px",
              }}
            />
            <Box width="100%">
              <Typography variant="body1" sx={{fontWeight: "medium"}}>
                {fileInfo.name}
              </Typography>
              <Typography variant="body2" color="grey">
                {formatFileSize(fileInfo.size)}
              </Typography>
            </Box>
          </Box>
        )}
      </SimpleForm>
    </Dialog>
  );
};

type CustomToolbarProps = {
  onClose: () => void;
  isLoading: boolean;
  handleImport: () => Promise<void>;
  file: File;
};

const CustomToolbar = ({
  file,
  handleImport,
  isLoading,
  onClose,
}: Readonly<CustomToolbarProps>) => {
  return (
    <Toolbar
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <Button onClick={onClose} disabled={isLoading} variant="outlined">
        Annuler
      </Button>
      <Button
        onClick={handleImport}
        color="primary"
        variant="contained"
        disabled={isLoading || !file}
      >
        Importer
      </Button>
    </Toolbar>
  );
};
