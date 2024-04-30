import { TopToolbar, Show, SimpleShowLayout, TextField } from "react-admin";
import { Box } from "@mui/material"
import { useParams } from "react-router-dom"

import { DateField } from "../common/components/fields";
import { PromotionEditButton } from "./PromotionEditButton";
import { PromotionGroupList } from "./components";
import { useRole } from "@/security/hooks";

export default function PromotionShow() {
  const role = useRole();
  const { id } = useParams();
  return (
    <Box>
      <Show
        id={id}
        title={"Promotion"}
        resource="promotions"
        actions={role.isManager() && (
          <TopToolbar>
            <PromotionEditButton id={id!} />
          </TopToolbar>
        )}
      >
        <SimpleShowLayout>
          <TextField source="name" label="Nom" />
          <TextField source="ref" label="Référence" />
          <DateField showTime source="creation_datetime" label="Date de création" />
        </SimpleShowLayout>
      </Show>
      <PromotionGroupList promotionId={id!} />
    </Box>
  )
}
