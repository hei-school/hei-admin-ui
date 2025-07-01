import {useRole} from "@/security/hooks";
import {Dialog} from "@/ui/components";
import {
  ButtonBase,
  DateTimeFilter,
  FilterForm,
  SelectInputFilter,
  TextFilter,
} from "@/ui/haToolbar";
import {mapToChoices} from "@/utils";
import {Add, Download} from "@mui/icons-material";
import {Box, MenuItem, Select, Typography} from "@mui/material";
import domtoimage from "dom-to-image-more";
import jsPDF from "jspdf";
import {FC, useCallback, useState} from "react";
import {Button, useRedirect} from "react-admin";
import {EVENT_TYPE_VALUE} from "../utils";

export const EventListAction: FC<{
  withDate?: boolean;
  onclose?: () => void;
  open?: boolean;
}> = ({withDate = true, onclose, open}) => {
  const {isManager, isAdmin, isOrganizer} = useRole();
  const redirect = useRedirect();

  return (
    <Box>
      {(isManager() || isAdmin() || isOrganizer()) && (
        <ButtonBase
          label="Créer"
          icon={<Add />}
          data-testid="add-filter"
          closeAction={false}
          onClick={() => redirect("/events/new")}
          children={<></>}
        />
      )}
      <FilterForm>
        <TextFilter label="Titre" source="title" />
        <SelectInputFilter
          choices={mapToChoices(EVENT_TYPE_VALUE, "id", "name")}
          label="Types"
          source="event_type"
        />
        {withDate && (
          <>
            <Typography
              variant="body2"
              fontWeight="bold"
              color="#B4B5B7"
              sx={{mt: 2, mb: 1}}
            >
              Filtre par plage de date
            </Typography>
            <DateTimeFilter source="from" label="De" />
            <DateTimeFilter source="to" label="À" />
          </>
        )}
      </FilterForm>
      <ExportEventFile open={open!} onclose={onclose!} />
    </Box>
  );
};

export const ExportEventFile: FC<{open: boolean; onclose: () => void}> = ({
  open,
  onclose,
}) => {
  const [exportFormat, setExportFormat] = useState<"jpg" | "pdf">("jpg");
  const exportOptions = {
    scale: 3,
    bgcolor: "white",
    quality: 1,
  };
  const exportToJpeg = (element: HTMLElement) =>
    domtoimage.toJpeg(element, exportOptions).then((dataUrl) => {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "calendar_week.jpg";
      link.click();
    });

  const exportToPdf = (element: HTMLElement) =>
    domtoimage.toJpeg(element, exportOptions).then((dataUrl) => {
      const pdf = new jsPDF("landscape");
      pdf.addImage(dataUrl, "JPEG", 10, 10, 280, 190);
      pdf.save("calendar_week.pdf");
    });

  const handleExport = useCallback(() => {
    const calendarElement =
      document.querySelector<HTMLElement>("#calendar_content");

    if (!calendarElement) {
      console.error("Element not found for export.");
      return;
    }

    const exportFunction = exportFormat === "jpg" ? exportToJpeg : exportToPdf;
    exportFunction(calendarElement).catch((error) =>
      console.error("Export failed:", error)
    );
  }, [exportFormat]);

  return (
    <Dialog
      onClose={onclose}
      open={open}
      title="Exporter l'emploi du temps"
      sx={{
        width: "35vw",
        marginInline: "auto",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        padding="1rem"
        gap="1rem"
        alignItems="center"
      >
        <Select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value as "jpg" | "pdf")}
          fullWidth
        >
          <MenuItem value="jpg">JPG</MenuItem>
          <MenuItem value="pdf">PDF</MenuItem>
        </Select>
        <Button
          variant="contained"
          startIcon={<Download />}
          data-testid="export-calendar-button"
          onClick={handleExport}
          label="Exporter le calendrier"
          sx={{
            width: "fit-content",
            padding: "1rem",
            fontWeight: "900",
            fontSize: "0.9rem",
          }}
        />
      </Box>
    </Dialog>
  );
};
