import {CheckCircle, ErrorOutline} from "@mui/icons-material";
import {List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import {ScanResult} from "../scanResults";

export const ScanResultList = ({results}: {results: ScanResult[]}) => (
  <List dense>
    {results.map((result) => (
      <ListItem key={result.key} disableGutters>
        <ListItemIcon sx={{minWidth: 36}}>
          {result.success ? (
            <CheckCircle color="success" />
          ) : (
            <ErrorOutline color="error" />
          )}
        </ListItemIcon>
        <ListItemText primary={result.label} secondary={result.detail} />
      </ListItem>
    ))}
  </List>
);
