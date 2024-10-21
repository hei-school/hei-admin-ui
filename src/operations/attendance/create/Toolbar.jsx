import {Box, Select, MenuItem, IconButton} from "@mui/material";
import {QrCodeScanner} from "@mui/icons-material";
import {FilterButton, FilterForm, Link, TextInput} from "react-admin";
import {AvailablePlace, qrcode} from "./config";

const filters = [
  <TextInput variant="outlined" source="ref" label="Référence" alwaysOn />,
  <TextInput variant="outlined" source="first_name" label="Prénom·s" />,
  <TextInput variant="outlined" source="last_name" label="Nom·s" />,
];

export const ToolBar = () => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
        <Select
          id="place"
          name="place"
          defaultValue={qrcode.defaultConfig.place}
          variant="outlined"
          size="small"
          onChange={(event) => qrcode.setConfig({place: event.target.value})}
        >
          {AvailablePlace.map((place, id) => (
            <MenuItem key={id} value={place.value}>
              {" "}
              {place.label}{" "}
            </MenuItem>
          ))}
        </Select>
        <FilterForm filters={filters} />
      </Box>
      <FilterButton
        style={{minWidth: "180px"}}
        filters={filters}
        disableSaveQuery
      />
    </Box>
  );
};
