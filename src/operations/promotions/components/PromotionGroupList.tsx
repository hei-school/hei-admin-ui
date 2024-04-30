import { HaList } from "@/ui/haList";
import { ShowButton, TextField } from "react-admin";
import { GroupsOutlined } from "@mui/icons-material";
import { DateField } from "@/operations/common/components/fields";

export function PromotionGroupList({ promotionId }: { promotionId: string }) {
  return (
    <HaList
      resource="promotions-groups"
      title="Liste des groupes"
      icon={<GroupsOutlined />}
      actions={false}
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
