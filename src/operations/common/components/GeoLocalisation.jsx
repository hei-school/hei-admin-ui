import {TextInput, useEditContext, number} from "react-admin";
import {Typography, Box} from "@mui/material";
import {PALETTE_COLORS} from "@/haTheme";

const NOT_DEFINED_POSITION = "Non défini.e";

export function createGoogleMapLink(coordinates) {
  const {longitude, latitude} = coordinates;
  return `https://www.google.com/maps/search/${latitude},${longitude}?entry=tts`;
}

export function GeoPositionName({
  coordinates = {longitude: 50000, latitude: 50000},
  ...rest
}) {
  const {longitude, latitude} = coordinates;
  const isDefinedPosition = longitude && latitude;
  return isDefinedPosition ? (
    <a
      rel="noreferrer"
      target="_blank"
      href={createGoogleMapLink(coordinates)}
      style={{
        color: PALETTE_COLORS.typography.grey,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontSize: "1rem",
        textDecoration: "underline",
      }}
    >
      {`${longitude}, ${latitude}`}
    </a>
  ) : (
    <Typography {...rest} variant="caption">
      {NOT_DEFINED_POSITION}
    </Typography>
  );
}

function GeoInput({coordinates = {longitude: null, latitude: null}, ...props}) {
  return (
    <Box sx={{display: "flex", width: "100%", alignItems: "center", gap: 3}}>
      <TextInput
        source="coordinates.latitude"
        label="Latitude"
        defaultValue={coordinates.latitude}
        validate={number()}
        data-testid="latitude-input"
        sx={{flex: 1}}
        {...props}
      />
      <TextInput
        source="coordinates.longitude"
        label="Longitude"
        data-testid="longitude-input"
        defaultValue={coordinates.longitude}
        validate={number()}
        sx={{flex: 1}}
        {...props}
      />
    </Box>
  );
}

export function EditGeoLocalisation(props) {
  const {record} = useEditContext();
  let coordinates = {longitude: undefined, latitude: undefined};

  if (record) coordinates = record.coordinates;
  return <GeoInput coordinates={coordinates} {...props} />;
}

export function CreateGeoLocalisation(props) {
  return <GeoInput {...props} />;
}
