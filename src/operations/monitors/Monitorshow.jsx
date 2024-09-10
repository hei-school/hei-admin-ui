import React from "react";
import {Show, SimpleShowLayout, TextField, EmailField} from "react-admin";
import {ProfileLayout} from "@/operations/common/components/ProfileLayout"; // Adaptez le chemin si nécessaire
import {WhoamiRoleEnum} from "@haapi/typescript-client";
import {COMMON_OUTLINED_BUTTON_PROPS} from "@/ui/constants/common_styles"; // Adaptez le chemin si nécessaire
import {EditButton} from "react-admin";

const ActionsOnShow = ({basePath, data, resource}) => (
  <EditButton
    basePath={basePath}
    resource={resource}
    record={data}
    {...COMMON_OUTLINED_BUTTON_PROPS}
  />
);

const MonitorShow = () => (
  <Show
    sx={{
      "& .RaShow-card": {
        backgroundColor: "transparent",
        boxShadow: "none",
      },
    }}
    actions={false}
    title="Détails de l'Étudiant"
  >
    <ProfileLayout
      role={WhoamiRoleEnum.MONITOR} // Assurez-vous que cette valeur est correcte pour les moniteurs
      actions={<ActionsOnShow />}
    >
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField source="name" />
        <EmailField source="email" />
      </SimpleShowLayout>
    </ProfileLayout>
  </Show>
);

export default MonitorShow;
