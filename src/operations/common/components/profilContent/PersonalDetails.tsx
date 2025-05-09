import {User} from "@/providers/types";
import {
  CakeOutlined as BirthDateIcon,
  AccountBoxOutlined as GenderIcon,
  FeaturedVideoOutlined as NicIcon,
  HowToRegOutlined as StatusIcon,
} from "@mui/icons-material";
import {Box, useMediaQuery} from "@mui/material";
import {FC} from "react";
import {getGenderInFr, getUserStatusInFr} from "../../utils/typo_util";
import {Title} from "../Title";
import {BirthDateField} from "../fields";
import HaField from "../fields/HaField";

export const PersonalDetails: FC<{}> = () => {
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
      <Title label="Détails personnels" />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isSmall ? "1fr" : "1fr 1fr",
          gap: "1rem",
        }}
      >
        <HaField
          label="Sexe"
          render={(user: User) => getGenderInFr(user.sex)}
          icon={<GenderIcon />}
          source={undefined}
        />
        <HaField
          label="Numéro CIN"
          source="nic"
          icon={<NicIcon />}
          render={undefined}
        />
        <HaField
          source=""
          label="Date et lieu de naissance"
          render={(user: User) => (
            <BirthDateField
              birthdate={user.birth_date}
              birthplace={user.birth_place}
              emptyText="Non défini.e"
            />
          )}
          icon={<BirthDateIcon />}
        />
        <HaField
          label="Statut"
          render={(user: User) => getUserStatusInFr(user.status, user.sex)}
          icon={<StatusIcon />}
          source={undefined}
        />
      </Box>
    </Box>
  );
};
