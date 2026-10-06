import {PALETTE_COLORS} from "@/haTheme";
import {Coordinates} from "@haapi-b0fc7615/typescript-client";
import {Box, Typography, TypographyProps} from "@mui/material";
import {
  number,
  RaRecord,
  TextInput,
  TextInputProps,
  useEditContext,
} from "react-admin";

const NOT_DEFINED_POSITION = "Non défini.e";

interface NullableCoordinates {
  longitude?: number | null;
  latitude?: number | null;
}

interface GeoLocatedRecord extends RaRecord {
  coordinates?: Coordinates;
}

type GeoPositionNameProps = TypographyProps & {
  coordinates?: Coordinates;
};

type GeoInputProps = Partial<TextInputProps> & {
  coordinates?: NullableCoordinates;
};

export const createGoogleMapLink = (coordinates: Coordinates) => {
  const {longitude, latitude} = coordinates;
  return `https://www.google.com/maps/search/${latitude},${longitude}?entry=tts`;
};

export const GeoPositionName = ({
  coordinates = {longitude: 50000, latitude: 50000},
  ...rest
}: Readonly<GeoPositionNameProps>) => {
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
};

const GeoInput = ({
  coordinates = {longitude: null, latitude: null},
  ...props
}: Readonly<GeoInputProps>) => {
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
};

export const EditGeoLocalisation = (
  props: Readonly<Partial<TextInputProps>>
) => {
  const {record} = useEditContext<GeoLocatedRecord>();
  let coordinates: NullableCoordinates | undefined = {
    longitude: undefined,
    latitude: undefined,
  };

  if (record) coordinates = record.coordinates;
  return <GeoInput coordinates={coordinates} {...props} />;
};

export const CreateGeoLocalisation = (props: Readonly<GeoInputProps>) => {
  return <GeoInput {...props} />;
};
