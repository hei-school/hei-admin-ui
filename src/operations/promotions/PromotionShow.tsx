import {TopToolbar, SimpleShowLayout, TextField} from "react-admin";
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
import {Box, useMediaQuery} from "@mui/material";
import {useParams} from "react-router-dom";
import {useNotify} from "@/hooks";
import {useRole} from "@/security/hooks";
import {EMPTY_TEXT} from "@/ui/constants";
import {DateField, FieldLabel} from "../common/components/fields";
import {Show} from "../common/components";
import {
  ResourceFlowsArgsType,
  ResourceFlowsContext,
  ResourceMigrateType,
} from "../common/components/resource-flows/ResourceFlowsContext";
import {PromotionGroupList} from "./components";
import {PromotionEditButton} from "./PromotionEditButton";
import promotionFlowsProvider from "@/providers/promotionFlowProvider";
import {PALETTE_COLORS} from "@/haTheme";

const SyleSx = (isSmall: boolean) => ({
  "& .css-jfdv4h-MuiStack-root > *": {
    marginTop: "0px",
  },
  "margin": "1em",
  "& .RaSimpleShowLayout-row": {
    marginBottom: "1em",
    borderColor: PALETTE_COLORS.grey,
    padding: "1.5em",
    borderRadius: "25px",
    backgroundColor: PALETTE_COLORS.primary,
    color: "white",
    flexBasis: isSmall ? "100%" : "32%",
  },
  "& .RaSimpleShowLayout-stack": {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
});

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
  const isSmall = useMediaQuery("(max-width:900px)");

  return (
    <Box>
      <Show
        id={id}
        title={"Promotion"}
        resource="promotions"
        actions={
          (role.isManager() || role.isAdmin()) && (
            <TopToolbar>
              <PromotionEditButton id={id!} />
            </TopToolbar>
          )
        }
      >
        <SimpleShowLayout sx={{...SyleSx(isSmall)}}>
          <TextField
            style={{marginTop: "0px"}}
            fontFamily="Arial"
            source="name"
            label={<FieldLabel icon={<NameIcon />}>Nom</FieldLabel>}
            emptyText={EMPTY_TEXT}
          />
          <TextField
            style={{marginTop: "0px !important"}}
            fontFamily="Arial"
            source="ref"
            sx={{
              "&. .css-jfdv4h-MuiStack-root": {
                marginTop: "0",
              },
            }}
            label={<FieldLabel icon={<ReferenceIcon />}>Référence</FieldLabel>}
            emptyText={EMPTY_TEXT}
          />
          <DateField
            style={{marginTop: "0px"}}
            fontFamily="Arial"
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
