import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@mui/material";
import axios from "axios";

function Map({ latitude, longitude }) {
  const [address, setAddress] = useState("");

  useEffect(() => {
    async function fetchAddress() {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      setAddress(response.data.display_name);
    }

    fetchAddress();
  }, [latitude, longitude]);

  const mapUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=18/${latitude}/${longitude}`;

  return (
    <>
      <h2>{address}</h2>
      <Card>
        <CardContent>
          <iframe
            title="Iframe content"
            src={mapUrl}
            width="100%"
            height="500"
            frameBorder="0"
            scrolling="auto"
            allowFullScreen
          />
        </CardContent>
      </Card>
    </>
  );
}

export default Map;
