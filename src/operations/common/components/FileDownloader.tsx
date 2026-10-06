import {PALETTE_COLORS} from "@/haTheme";
import {useNotify} from "@/hooks";
import {Download} from "@mui/icons-material";
import {
  Button,
  ButtonProps,
  CircularProgress,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import {useState} from "react";

// the file content comes in "data"; no response means there is nothing to download
interface DownloadedFile {
  data?: ArrayBuffer | null;
}

export type FileDownloaderProps = {
  downloadFunction: () => Promise<DownloadedFile | undefined>;
  fileName: string;
  successMessage: string;
  errorMessage: string;
  fileType?: string;
  buttonProps?: ButtonProps;
  buttonText: string;
} & {"data-testid"?: string} & Omit<ButtonProps, "children">;

const downloadBlob = (blob: Blob, fileName: string) => {
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const FileDownloader = ({
  downloadFunction,
  fileName,
  successMessage,
  startIcon,
  errorMessage,
  buttonText,
  fileType = "application/pdf",
  "data-testid": dataTestId = "download-button",
  ...raButtonProps
}: FileDownloaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const notify = useNotify();
  const handleDownload = async () => {
    setIsLoading(true);
    notify(successMessage);
    try {
      const response = await downloadFunction();
      const data = response?.data;
      if (!data || data.byteLength <= 0) {
        notify(errorMessage, {type: "error"});
        return;
      }
      downloadBlob(new Blob([data], {type: fileType}), fileName);
    } catch {
      notify(errorMessage, {type: "error"});
    } finally {
      setIsLoading(false);
    }
  };
  const isSmall = useMediaQuery("(max-width:900px)");
  return (
    <div style={{padding: 0, margin: 0}}>
      {isSmall ? (
        <IconButton
          onClick={handleDownload}
          data-testid={dataTestId}
          disabled={isLoading}
        >
          <Download
            sx={{
              color: PALETTE_COLORS.primary,
              cursor: "pointer",
            }}
          />
        </IconButton>
      ) : (
        <Button
          {...raButtonProps}
          disabled={isLoading}
          onClick={handleDownload}
          data-testid={dataTestId}
          startIcon={isLoading ? <CircularProgress size={20} /> : startIcon}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
};
