import React, {useState} from "react";

import {Scope} from "@haapi/typescript-client";
import {SimpleForm, TextInput} from "react-admin";
import {MarkdownInput} from "@react-admin/ra-markdown";
import {Box, Typography} from "@mui/material";
import {Create} from "../common/components";
import {SelectScope} from "./components/SelectScope";
import {SelectGroup} from "./components/SelectGroup";
import authProvider from "@/providers/authProvider";

const transformAnnouncement = ({target_group_list, ...announcement}: any) => {
  const {id} = authProvider.getCachedWhoami();

  const targetGroups = target_group_list
    ? target_group_list.map((id: string) => ({id}))
    : [];

  return {
    ...announcement,
    author_id: id,
    target_group_list: targetGroups,
  };
};

export const AnnouncementCreate = () => {
  const [scope, setScope] = useState("");

  return (
    <Create title="Annonces" transform={transformAnnouncement}>
      <SimpleForm>
        <TextInput source="title" label="Titre" fullWidth required />
        <SelectScope setScope={setScope} />
        {scope === Scope.STUDENT && (
          <Box sx={{width: "100%"}}>
            <Typography variant="caption">
              Si vous voulez être plus précis, vous pouvez sélectionner des
              groupes spécifiques.
            </Typography>
            <SelectGroup />
          </Box>
        )}
        <MarkdownInput
          source="content"
          label="Contenu de l'annonce"
          fullWidth
          isRequired
        />
      </SimpleForm>
    </Create>
  );
};
