import {TopToolbar, Show, SimpleShowLayout, TextField} from "react-admin";
import {
  Fingerprint as ReferenceIcon,
  PermIdentity as NameIcon,
  CalendarMonth as CreationDateIcon,
} from "@mui/icons-material";
import {
  Group,
  Promotion,
  UpdatePromotionSGroupTypeEnum,
} from "@haapi/typescript-client";
import {Box} from "@mui/material";
import {DateField, FieldLabel} from "../common/components/fields";
import {PromotionEditButton} from "./PromotionEditButton";
import {PromotionGroupList} from "./components";
import {
  ResourceFlowsArgsType,
  ResourceFlowsContext,
  ResourceMigrateType,
} from "../common/components/resource-flows/ResourceFlowsContext";
import {useParams} from "react-router-dom";
import {useNotify} from "@/hooks";
import {useRole} from "@/security/hooks";
import {EMPTY_TEXT} from "@/ui/constants";
import promotionFlowsProvider from "@/providers/promotionFlowProvider";

function getSuccessMessage({
  type,
  resources: groups,
}: ResourceFlowsArgsType<Required<Group>, Required<Promotion>>) {
  switch (type) {
    case "MIGRATE":
      return `Le groupe ${groups[0].ref} a été migré avec succès`;
    case "LEAVE":
      return `Le groupe ${groups[0].ref} a été retiré avec succès`;
    default:
      return "Tous les groupes ont été insérés avec succès!";
  }
}

function getErrorMessage(type: ResourceMigrateType, groups: Group[]) {
  switch (type) {
    case "MIGRATE":
      return `Erreur lors de la migration du groupe ${groups[0].ref}`;
    case "LEAVE":
      return `Erreur lors du retrait du groupe ${groups[0].ref}`;
    default:
      return `Erreur lors de l'opération sur les groupes.`;
  }
}

function migratePromotionGroup({
  id,
  type,
  resources,
  parent,
}: {id: string} & ResourceFlowsArgsType<Required<Group>, Required<Promotion>>) {
  const promotionFlowType: UpdatePromotionSGroupTypeEnum =
    type !== "LEAVE"
      ? UpdatePromotionSGroupTypeEnum.ADD
      : UpdatePromotionSGroupTypeEnum.REMOVE;
  return promotionFlowsProvider.saveOrUpdate(
    [
      {
        type: promotionFlowType,
        group_ids: resources.map((group) => group.id),
      },
    ],
    {promotionId: type == "MIGRATE" ? parent.id : id}
  );
}

export default function PromotionShow() {
  const role = useRole();
  const {id} = useParams();
  const notify = useNotify();

  return (
    <Box>
      <Show
        id={id}
        title={"Promotion"}
        resource="promotions"
        actions={
          role.isManager() && (
            <TopToolbar>
              <PromotionEditButton id={id!} />
            </TopToolbar>
          )
        }
      >
        <SimpleShowLayout>
          <TextField
            source="name"
            label={<FieldLabel icon={<NameIcon />}>Nom</FieldLabel>}
            emptyText={EMPTY_TEXT}
          />
          <TextField
            source="ref"
            label={<FieldLabel icon={<ReferenceIcon />}>Référence</FieldLabel>}
            emptyText={EMPTY_TEXT}
          />
          <DateField
            source="creation_datetime"
            label={
              <FieldLabel icon={<CreationDateIcon />}>
                Date de création
              </FieldLabel>
            }
            emptyText={EMPTY_TEXT}
          />
        </SimpleShowLayout>
      </Show>
      <ResourceFlowsContext<Required<Group>, Required<Promotion>>
        childResource="groups"
        parentResource="promotions"
        parentId={id!}
        provider={(args) => migratePromotionGroup({id: id!, ...args})}
        onSuccess={(args) => {
          notify(getSuccessMessage(args), {type: "success"});
        }}
        onError={({type, resources}) => {
          notify(getErrorMessage(type, resources), {type: "error"});
        }}
      >
        <PromotionGroupList />
      </ResourceFlowsContext>
    </Box>
  );
}
