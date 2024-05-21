import {useParams} from "react-router-dom";
import {HaList} from "@/ui/haList";
import {Group, Promotion} from "@haapi/typescript-client";
import {ShowButton, TextField, useListContext} from "react-admin";
import {GroupsOutlined} from "@mui/icons-material";
import {
  InsertButton,
  LeaveButton,
  MigrateButton,
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
        rowClick: false,
      }}
      listProps={{title: " ", queryOptions: {meta: {promotionId: id}}}}
      actions={<InsertPromotionGroup />}
    >
      <TextField source="name" label="Nom" />
      <TextField source="ref" label="Référence" />
      <ShowButton resource="groups" />
      <MigrateButton<Required<Group>, Required<Promotion>>
        dialogProps={{
          title: () => "Sélectionner la promotion de destination",
          showField: "ref",
          autoCompleteLabel: "Référence de la promotion",
        }}
      />
      <LeaveButton<Required<Group>>
        dialogProps={{
          title: () =>
            `Êtes-vous sûr de vouloir retirer ce groupe de cette promotion ?`,
        }}
      />
    </HaList>
  );
}
