import {FC, useRef, useState} from "react";
import {
  CircularProgress,
  Button,
  ButtonProps,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import {Download} from "@mui/icons-material";

import {useNotify} from "@/hooks";
import {PALETTE_COLORS} from "@/haTheme";

export type FileDownloaderProps = {
  downloadFunction: () => Promise<any>;
  fileName: string;
  successMessage: string;
  errorMessage: string;
  fileType?: string;
  buttonProps?: ButtonProps;
  buttonText: string;
} & Omit<ButtonProps, "children">;

export const FileDownloader: FC<FileDownloaderProps> = ({
  downloadFunction,
  fileName,
  successMessage,
  startIcon,
  errorMessage,
  buttonText,
  fileType = "application/pdf",
  ...raButtonProps
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const fileLinkRef = useRef<HTMLAnchorElement>(null);
  const notify = useNotify();

  const handleDownload = async () => {
    setIsLoading(true);
    const linkRef = fileLinkRef.current;
    notify(successMessage);

    try {
      const {data} = await downloadFunction();
      if (!data || data.byteLength <= 0) {
        notify(errorMessage, {type: "error"});
        return;
      }

      if (linkRef === null) {
        return;
      }

      linkRef.href = window.URL.createObjectURL(
        new Blob([data], {type: fileType})
      );
      linkRef.download = fileName;
      linkRef.click();
    } catch {
      notify(errorMessage, {type: "error"});
    } finally {
      setIsLoading(false);
    }
  };
  const isSmall = useMediaQuery("(max-width:900px)");

  return (
    <div style={{padding: 0, margin: 0}}>
      <a data-testid="file-link" ref={fileLinkRef} style={{display: "none"}} />
      {isSmall ? (
        <IconButton
          onClick={handleDownload}
          data-testid="download-button"
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
          data-testid="download-button"
          startIcon={isLoading ? <CircularProgress size={20} /> : startIcon}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
};
