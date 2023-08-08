import { Error } from '@mui/icons-material';
import { Box, Card, CardContent, CardHeader, LinearProgress, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Document as Pdf, Page as PdfPage } from 'react-pdf/dist/esm/entry.webpack';

export const ErrorHandling = ({ errorMessage }) => (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Error style={{ fontSize: 40 }} />
    <Typography variant='body2'>{errorMessage}</Typography>
  </Box>
);

const PdfViewer = props => {
  const { url, filename, isPending, noData, onLoadError, children, ...others } = props;
  const loadErrorMessage = 'Échec de chargement du document';
  const [isLoading, setLoading] = useState(true);
  const pdfRef = useRef(null);

  const stopLoading = () => setLoading(false);
  const startLoading = useCallback(() => setLoading(true), [setLoading]);

  useEffect(() => {
    startLoading();
  }, [url, startLoading]);

  return (
    <Box {...others}>
      <Card ref={pdfRef}>
        {isPending && <LinearProgress />}
        <CardHeader title='Relevé de notes' />
        <CardContent sx={{ ...(url && !isLoading && { paddingInline: 0 }), justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
          {url ? (
            <Pdf
              noData={noData || <Typography variant='body2'>En attente du document ...</Typography>}
              error={onLoadError || <ErrorHandling errorMessage={loadErrorMessage} />}
              loading={<LoadingMessage />}
              file={!isPending ? url : null}
            >
              <PdfPage
                loading={<LoadingMessage />}
                onLoadSuccess={stopLoading}
                pageNumber={1}
                width={pdfRef.current && pdfRef.current.clientWidth - 50}
              />
            </Pdf>
          ) : (
            <Typography variant='body2'>En attente du document ...</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

const LoadingMessage = () => <Typography variant='body2'>Chargement du document ...</Typography>;

export default PdfViewer;