import {HaList} from "@/ui/haList";
import {Group} from "@haapi/typescript-client";
import {TextField, useListContext} from "react-admin";
import {useParams} from "react-router-dom";
import {GroupsOutlined} from "@mui/icons-material";
import {
  InsertButton,
  LeaveButton,
} from "@/operations/common/components/resource-flows";

function InsertPromotionGroup() {
  const listContext = useListContext<Required<Group>>();
  return (
    <InsertButton<Required<Group>>
      excludes={listContext.data.map((el) => el.id)}
      dialogProps={{
        showField: "ref",
        title: "Sélectionner les groupes à insérer",
        autoCompleteLabel: "Référence du group",
      }}
    />
  );
}

export function PromotionGroupList() {
  const {id} = useParams();
  return (
    <HaList
      resource="promotions-groups"
      title="Liste des groupes"
      icon={<GroupsOutlined />}
      datagridProps={{
        rowClick: (groupId: string) => `/groups/${groupId}/show`,
      }}
      listProps={{title: " ", queryOptions: {meta: {promotionId: id}}}}
      actions={<InsertPromotionGroup />}
    >
      <TextField source="ref" label="Référence" />
      <TextField source="name" label="Nom" />
      <LeaveButton<Required<Group>>
        dialogProps={{
          title: () =>
            `Êtes-vous sûr de vouloir retirer ce groupe de cette promotion ?`,
        }}
      />
    </HaList>
  );
}
