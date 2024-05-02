import React from "react";

import {Box, Divider, Typography} from "@mui/material";
import {DateTimeFilter, FilterForm, SelectInputFilter} from "@/ui/haToolbar";
import {ANNOUNCEMENT_SCOPE} from "../utils/constants/announcementsScopes";

const DEFAULT_CHOICE = {id: "", name: "Aucune valeur"};

const ANNOUNCEMENT_CHOICES = [
  DEFAULT_CHOICE,
  ...Object.entries(ANNOUNCEMENT_SCOPE).map(([id, name]) => ({id, name})),
];

export const AnnouncementFilter = () => {
  return (
    <Box>
      <FilterForm>
        <SelectInputFilter
          label="Portée de l'annonce"
          source="scope"
          choices={ANNOUNCEMENT_CHOICES}
          defaultValue={DEFAULT_CHOICE.name}
        />
        <Divider sx={{mt: 2, mb: 1}} />
        <Typography
          variant="body2"
          fontWeight="bold"
          color="#B4B5B7"
          sx={{mt: 2, mb: 1}}
        >
          Filtre par plage de date
        </Typography>
        <DateTimeFilter source="from" label="De" />
        <DateTimeFilter source="to" label="À" />
      </FilterForm>
    </Box>
  );
};
