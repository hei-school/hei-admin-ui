import React from "react";
import {Box, Typography, Divider} from "@mui/material";
import {
  CreateButton,
  FilterForm,
  TextFilter,
  DateTimeFilter,
} from "../../../ui/haToolbar";

export const AnnouncementFilter = () => {
  return (
    <Box>
      <CreateButton resource="announcements" />
      <FilterForm>
        <TextFilter source="authorRef" label="Référence de l'auteur" />
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
