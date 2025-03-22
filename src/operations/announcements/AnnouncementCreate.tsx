import {useState} from "react";

import authProvider from "@/providers/authProvider";
import {Scope} from "@haapi/typescript-client";
import {Box, Typography} from "@mui/material";
import {MarkdownInput} from "@react-admin/ra-markdown";
import {SimpleForm, TextInput} from "react-admin";
import {Create} from "../common/components";
import {SelectGroup} from "./components/SelectGroup";
import {SelectScope} from "./components/SelectScope";

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
    <Create
      title="Annonces"
      mutationOptions={{
        meta: {
          method: "CREATE",
        },
      }}
      transform={transformAnnouncement}
    >
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
