import {useRef, useState} from "react";
import {CircularProgress} from "@mui/material";
import {useNotify} from "@/hooks";
import {PALETTE_COLORS} from "@/haTheme";

export function FileDownloader({
  downloadFunction,
  fileName,
  buttonText,
  successMessage,
  errorMessage,
  fileType = "application/pdf",
}) {
  const [isLoading, setIsLoading] = useState(false);
  const fileLinkRef = useRef(null);
  const notify = useNotify();

  const handleDownload = () => {
    setIsLoading(true);
    const linkRef = fileLinkRef.current;
    notify(successMessage, {autoHideDuration: 5000});
    downloadFunction()
      .then(({data}) => {
        if (!data || data.byteLength <= 0) {
          notify(errorMessage, {type: "error"});
          return;
        }
        linkRef.href = window.URL.createObjectURL(
          new Blob([data], {type: fileType})
        );
        linkRef.download = fileName;
        linkRef.click();
        setIsLoading(false);
      })
      .catch((error) => {
        notify(errorMessage, {type: "error"});
        setIsLoading(false);
      });
  };

  return (
    <div style={{padding: 0, margin: 0}}>
      <a data-testid="file-link" ref={fileLinkRef} style={{display: "none"}} />
      <a
        data-testid="download-button"
        aria-disabled={isLoading}
        onClick={handleDownload}
      >
        {isLoading ? (
          <CircularProgress
            size={40}
            style={{margin: "7px"}}
            sx={{
              ".MuiCircularProgress-circle": {
                color: PALETTE_COLORS.yellow,
              },
            }}
          />
        ) : (
          buttonText
        )}
      </a>
    </div>
  );
}
