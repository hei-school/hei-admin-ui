import {User} from "@/providers/types";
import {
  LocationOnOutlined as AdressIcon,
  MapOutlined as GeoIcon,
  MailOutlined as MailIcon,
  PhoneOutlined as PhoneIcon,
} from "@mui/icons-material";
import {Box, useMediaQuery} from "@mui/material";
import {GeoPositionName} from "../GeoLocalisation";
import {Title} from "../Title";
import HaField from "../fields/HaField";

export const Contact = () => {
  const isSmall = useMediaQuery("(max-width:900px)");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
        width: "100%",
        padding: "1rem",
      }}
    >
      <Title label="Coordonnées" />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isSmall ? "1fr" : "1fr 1fr",
          gap: "1rem",
        }}
      >
        <HaField
          label="Email"
          icon={<MailIcon />}
          render={(user: User) => (
            <a
              href={`mailto:${user.email}`}
              target="_blank"
              style={{color: "inherit"}}
            >
              {user.email}
            </a>
          )}
          source={undefined}
        />
        <HaField
          label="Téléphone"
          source="phone"
          icon={<PhoneIcon />}
          render={undefined}
        />
        <HaField
          label="Adresse"
          source="address"
          icon={<AdressIcon />}
          render={undefined}
        />
        <HaField
          source={undefined}
          label="Géolocalisation"
          icon={<GeoIcon />}
          render={(user: User) => (
            <GeoPositionName coordinates={user.coordinates as any} />
          )}
        />
      </Box>
    </Box>
  );
};
