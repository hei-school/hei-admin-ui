import {HaList} from "@/ui/haList";
import {Group} from "@haapi/typescript-client";
import {TextField} from "react-admin";
import {GroupsOutlined} from "@mui/icons-material";
import {
  InsertButton,
  LeaveButton,
} from "@/operations/common/components/resource-flows";

export function PromotionGroupList({promotionId}: {promotionId: string}) {
  return (
    <HaList
      resource="promotions-groups"
      title="Liste des groupes"
      icon={<GroupsOutlined />}
      datagridProps={{
        rowClick: (id: string) => `/groups/${id}/show`,
      }}
      actions={
        <InsertButton<Required<Group>>
          dialogProps={{
            showField: "ref",
            title: "Sélectionner les groupes à insérer",
            autoCompleteLabel: "Référence du group",
          }}
        />
      }
      listProps={{title: " ", queryOptions: {meta: {promotionId}}}}
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
