import axios from "axios"
import { useEffect, useState } from "react";
import { TextInput, useEditContext, number } from "react-admin";
import { Typography, Box } from "@mui/material"

import { getObjValue } from "../../../ui/utils/utils";
import { PALETTE_COLORS } from "../../../ui/constants/palette";

const NOT_DEFINED_POSITION = "Non défini.e";

export function createGoogleMapLink(coordinates) {
    const { longitude, latitude } = coordinates;
    return `https://www.google.com/maps/search/${latitude},${longitude}?entry=tts`
}

export function parseGeoLocalisation(coordinates) {
    console.log(coordinates);
}

export function GeoPositionName({ coordinates, ...rest }) {
    const [positionName, setPositionName] = useState(NOT_DEFINED_POSITION);
    const { longitude, latitude } = coordinates;
    const TO_ADRESS_URL = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    useEffect(() => {
        const fetchPosition = async () => {
            axios.get(TO_ADRESS_URL)
                .then((response => {
                    const address = getObjValue(response, "data.address");
                    if (address)
                        setPositionName(`${address.suburb}, ${address.city}`)
                }))
                .catch(() => { });
        }
        fetchPosition();
    }, [longitude, latitude])

    return (
        positionName !== NOT_DEFINED_POSITION ?
            <a
                target="_blank"
                href={createGoogleMapLink(coordinates)}
                style={{
                    color: PALETTE_COLORS.typography.grey,
                    fontSize: "14px",
                    textDecoration: "underline"
                }}
            >
                {positionName}
            </a>
            : <Typography {...rest}>{positionName}</Typography>
    )
}

export function EditGeoLocalisation(props) {
    const { record } = useEditContext();
    const { coordinates } = record;

    return (
        <Box sx={{display: "flex", width: "100%", alignItems: "center", gap: 3}}>
            <TextInput
                source="latitude"
                label="Latitude"
                defaultValue={coordinates.latitude}
                validate={number()}
                sx={{flex: 1}}
                {...props}
            />
            <TextInput
                source="longitude"
                label="Longitude"
                defaultValue={coordinates.longitude}
                validate={number()}
                sx={{flex: 1}}
                {...props}
            />
        </Box>
    )
}
