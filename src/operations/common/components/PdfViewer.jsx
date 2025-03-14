import {PALETTE_COLORS} from "@/haTheme";
import {
  DownloadForOffline,
  Error,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import axios from "axios";
import "pdfjs-dist/build/pdf.min.mjs";
import "pdfjs-dist/build/pdf.worker.min.mjs";
import {useEffect, useRef, useState} from "react";
import {useNotify} from "react-admin";
import {Document as Pdf, Page as PdfPage} from "react-pdf";

const TooltipButton = ({icon, disabled, onClick, ...others}) => (
  <Tooltip {...others} sx={{margin: "0 6px"}}>
    <IconButton onClick={onClick} disabled={disabled}>
      {icon}
    </IconButton>
  </Tooltip>
);

const STYLE = {
  width: "max-content",
  minHeight: "max-content",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: "13px",
  backgroundColor: "#fff",
  padding: "0.1rem",
};

const PDF_LOADING_ERROR_MESSAGE = "Échec de chargement du document";

export const HorizontalPagination = ({
  maxSteps,
  activeStep,
  setActiveStep,
  boxSx,
}) => {
  const theme = useTheme();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{...STYLE, ...boxSx}}>
      <IconButton
        size="small"
        onClick={handleBack}
        data-test-item="pdf-prev"
        disabled={activeStep === 1 || maxSteps === 0}
      >
        {theme?.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>

      <Typography>
        {activeStep} / {maxSteps}
      </Typography>

      <IconButton
        size="small"
        onClick={handleNext}
        data-test-item="pdf-next"
        disabled={activeStep === maxSteps || maxSteps === 0}
      >
        {theme?.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
    </Box>
  );
};

export const PdfLoadingError = () => (
  <Box sx={{display: "flex", alignItems: "center"}}>
    <Error style={{fontSize: 40}} />
    <Typography variant="body2">{PDF_LOADING_ERROR_MESSAGE}</Typography>
  </Box>
);

// TODO: migrate to ts
const PdfViewer = (props) => {
  const {url, filename, isPending, noData, onLoadError, children, ...others} =
    props;
  const [pages, setPages] = useState({current: 1, last: null});
  const pdfRef = useRef(null);

  const notify = useNotify();

  const setLastPage = ({numPages}) => {
    setPages((e) => ({...e, last: numPages}));
  };

  const setPage = (callback) => {
    setPages((e) => ({...e, current: callback(e.current)}));
  };

  const [binary, setBinary] = useState();
  const [loadingBinary, setLoadingBinary] = useState(true);

  useEffect(() => {
    const retrievePdf = async () => {
      setLoadingBinary(true);
      try {
        const res = await axios.get(url, {
          headers: {"Content-Type": "application/pdf"},
          responseType: "blob",
        });

        if (res.data) {
          setBinary(res.data);
        }
      } catch (e) {
        notify("An error occurred while loading the pdf.", {type: "error"});
      } finally {
        setLoadingBinary(false);
      }
    };
    if (url) void retrievePdf();
  }, [notify, url]);

  const isLoadingPdf = isPending || loadingBinary;

  return (
    <Box {...others}>
      <Card ref={pdfRef}>
        {isLoadingPdf && <LinearProgress />}
        <Box
          display="flex"
          justifyContent="space-between"
          style={{backgroundColor: PALETTE_COLORS.yellow}}
        >
          <CardHeader title={`Document : ${filename}`} />
          <Stack
            flexDirection="row"
            sx={{alignItems: "center", padding: "0.2rem 0.2rem 0 0"}}
          >
            {url && isLoadingPdf && (
              <HorizontalPagination
                activeStep={pages.current}
                maxSteps={pages.last}
                setActiveStep={setPage}
              />
            )}
            {children}
            <a
              href={url}
              data-testid="download-link"
              target="_blank"
              rel="noreferrer"
              download={filename + ".pdf"}
            >
              <TooltipButton
                title="Télécharger"
                icon={
                  <DownloadForOffline
                    style={{
                      color: PALETTE_COLORS.white,
                      width: 30,
                      height: 30,
                    }}
                  />
                }
              />
            </a>
          </Stack>
        </Box>
        <CardContent
          sx={{
            ...(url && !isLoadingPdf ? {paddingInline: 0} : {}),
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
          }}
        >
          {url ? (
            <Pdf
              noData={
                noData || (
                  <Typography variant="body2">
                    En attente du document ...
                  </Typography>
                )
              }
              error={onLoadError || <PdfLoadingError />}
              file={!isLoadingPdf && binary ? binary : null}
              loading={<LoadingMessage />}
              onLoadSuccess={(cb) => {
                setLastPage({numPages: cb.numPages});
                setLoadingBinary(false);
              }}
            >
              <PdfPage
                loading={<LoadingMessage />}
                width={pdfRef.current && pdfRef.current.clientWidth - 50}
                pageNumber={pages.current}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                customTextRenderer={false}
              />
            </Pdf>
          ) : (
            <Typography variant="body2">En attente du document ...</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

const LoadingMessage = () => (
  <Typography variant="body2">Chargement du document ...</Typography>
);

export default PdfViewer;
