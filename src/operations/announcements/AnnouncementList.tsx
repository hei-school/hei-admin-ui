import React, {FC} from "react";
import {EmailField, FunctionField, TextField} from "react-admin";
import {Announcement, Scope} from "@haapi/typescript-client";
import {Newspaper as AnnoucementIcon} from "@mui/icons-material";
import {Chip} from "@mui/material";
import {HaList} from "../../ui/haList";
import {DateField} from "../common/components/fields";
import {AnnouncementFilter} from "./components/AnnouncementsFilter";
import {PALETTE_COLORS} from "src/ui/constants";

export const ANNOUNCEMENT_SCOPE: any = {
  GLOBAL: "Tout le monde",
  MANAGER: "Managers uniquement",
  STUDENT: "Étudiants uniquement",
  TEACHER: "Enseignants uniquement",
};

interface ScopeFieldProps {
  scope: string;
}

const getChipColor = (scope: string) => {
  switch (scope) {
    case Scope.GLOBAL:
      return PALETTE_COLORS.red;
    case Scope.STUDENT:
      return PALETTE_COLORS.yellow;
    case Scope.TEACHER:
      return PALETTE_COLORS.primary;
    case Scope.MANAGER:
      return PALETTE_COLORS.black;
    default:
      return PALETTE_COLORS.black;
  }
};

const ScopeField: FC<ScopeFieldProps> = ({scope}: ScopeFieldProps) => {
  return (
    <Chip
      label={ANNOUNCEMENT_SCOPE[scope]}
      sx={{backgroundColor: getChipColor(scope), color: PALETTE_COLORS.white}}
    />
  );
};

export const AnnouncementList = () => {
  return (
    <HaList
      title="Liste des annonces"
      resource="announcements"
      actions={<AnnouncementFilter />}
      icon={<AnnoucementIcon />}
    >
      <TextField source="title" label="Titre" />
      <DateField source="creation_datetime" label="Date de création" showTime />
      <FunctionField
        label="Portée de l'annonce"
        render={(record: Announcement) => <ScopeField scope={record?.scope!} />}
      />
      <EmailField source="author.email" label="Auteur" />
    </HaList>
  );
};
