import React from "react";

import {Show, SimpleShowLayout, TextField} from "react-admin";
import {MarkdownField} from '@react-admin/ra-markdown';

export const AnnouncementShow = () => {
  return (
  <Show title="Annonce">
    <SimpleShowLayout>
      <TextField source="title" label="Titre"/>
      <TextField source="author.first_name" label="Auteur" />
      <MarkdownField source="content" label="Contenu"/>
    </SimpleShowLayout>
  </Show>);
};
