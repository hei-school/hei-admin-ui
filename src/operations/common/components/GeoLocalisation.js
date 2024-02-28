import axios from "axios";
import {useEffect, useState} from "react";
import {TextInput, useEditContext, number} from "react-admin";
import {Typography, Box} from "@mui/material";

import {PALETTE_COLORS} from "../../../ui/constants/palette";

const NOT_DEFINED_POSITION = "Non défini.e";

export function createGoogleMapLink(coordinates) {
  const {longitude, latitude} = coordinates;
  return `https://www.google.com/maps/search/${latitude},${longitude}?entry=tts`;
}

function formatGeoInformation(displayName) {
  try {
    const infos = displayName.split(",");
    return infos.slice(0, 3).join(", ");
  } catch (e) {
    console.log(e);
    return displayName;
  }
}

export function GeoPositionName({
  coordinates = {longitude: 50000, latitude: 50000},
  ...rest
}) {
  const {longitude, latitude} = coordinates;
  const [positionName, setPositionName] = useState(NOT_DEFINED_POSITION);
  const TO_ADRESS_URL = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

  useEffect(() => {
    const fetchPosition = async () => {
      axios
        .get(TO_ADRESS_URL)
        .then((response) => {
          if (response.data.display_name)
            setPositionName(formatGeoInformation(response.data.display_name));
        })
        // NOT_DEFINED_POSITION will be shown automatically
        .catch(() => {});
    };
    fetchPosition();
  }, [longitude, latitude]);

  return positionName !== NOT_DEFINED_POSITION ? (
    <a
      target="_blank"
      href={createGoogleMapLink(coordinates)}
      style={{
        color: PALETTE_COLORS.typography.grey,
        fontSize: "14px",
        textDecoration: "underline",
      }}
    >
      {positionName}
    </a>
  ) : (
    <Typography {...rest}>{positionName}</Typography>
  );
}

function GeoInput({coordinates = {longitude: null, latitude: null}, ...props}) {
  return (
    <Box sx={{display: "flex", width: "100%", alignItems: "center", gap: 3}}>
      <TextInput
        source="latitude"
        label="Latitude"
        defaultValue={coordinates.latitude}
        validate={number()}
        data-testid="latitude-input"
        sx={{flex: 1}}
        {...props}
      />
      <TextInput
        source="longitude"
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
