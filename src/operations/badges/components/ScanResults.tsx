import {CheckCircle, ErrorOutline, WarningAmber} from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {ScanResult} from "../scanResults";

const ResultIcon = ({result}: {result: ScanResult}) => {
  if (!result.success) return <ErrorOutline color="error" />;
  return result.warning ? (
    <WarningAmber color="warning" />
  ) : (
    <CheckCircle color="success" />
  );
};

export const ScanResultList = ({results}: {results: ScanResult[]}) => (
  <List dense>
    {results.map((result) => (
      <ListItem key={result.key} disableGutters>
        <ListItemIcon sx={{minWidth: 36}}>
          <ResultIcon result={result} />
        </ListItemIcon>
        <ListItemText
          primary={result.label}
          secondary={
            <>
              {result.detail}
              {result.warning && (
                <Typography
                  component="span"
                  variant="body2"
                  display="block"
                  color="warning.main"
                  fontWeight={600}
                  data-testid="scan-result-warning"
                >
                  {result.warning}
                </Typography>
              )}
            </>
          }
        />
      </ListItem>
    ))}
  </List>
);
