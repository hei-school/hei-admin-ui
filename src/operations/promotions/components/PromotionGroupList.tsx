import { HaList } from "@/ui/haList";
import { Group } from "@haapi/typescript-client";
import { ShowButton, TextField } from "react-admin";
import { GroupsOutlined } from "@mui/icons-material";
import { DateField } from "@/operations/common/components/fields";
import { InsertButton } from "@/operations/common/components/resource-flows";

export function PromotionGroupList({ promotionId }: { promotionId: string }) {
  return (
    <HaList
      resource="promotions-groups"
      title="Liste des groupes"
      icon={<GroupsOutlined />}
      actions={
        <InsertButton<Required<Group>>
          dialogProps={{
            showField: "ref",
            title: "Sélectionner les groupes à insérer",
            autoCompleteLabel: "Référence du group"
          }}
        />
      }
      listProps={{ title: " ", queryOptions: { meta: { promotionId } } }}
    >
      <TextField source="ref" label="Référence" />
      <TextField source="name" label="Nom" />
      <DateField
        source="creation_datetime"
        label="Année de création"
        showTime={false}
      />
      <ShowButton />
    </HaList>
  )
}
