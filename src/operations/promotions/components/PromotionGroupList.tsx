import {useParams} from "react-router-dom";
import {HaList} from "@/ui/haList";
import {Group, Promotion} from "@haapi/typescript-client";
import {
  ShowButton,
  TextField,
  useDataProvider,
  useListContext,
} from "react-admin";
import {GroupsOutlined, Download} from "@mui/icons-material";
import {
  InsertButton,
  LeaveButton,
  MigrateButton,
} from "@/operations/common/components/resource-flows";
import {FileDownloader} from "@/operations/common/components";

function ActionsPromotionsGroups() {
  const listContext = useListContext<Required<Group>>();
  const {id} = useParams();
  const dataProvider = useDataProvider();

  const downloadFile = async () => {
    const {
      data: {file},
    } = await dataProvider.getOne("promotions-export", {
      id,
    });
    return {data: file};
  };

  return (
    <>
      <InsertButton<Required<Group>>
        excludes={listContext.data.map((el) => el.id)}
        dialogProps={{
          showField: "ref",
          title: "Sélectionner les groupes à insérer",
          autoCompleteLabel: "Référence du group",
        }}
      />
      <FileDownloader
        downloadFunction={downloadFile}
        fileName="Liste des étudiants"
        startIcon={<Download />}
        sx={{
          textTransform: "none",
          color: "inherit",
        }}
        buttonText="Exporter"
        successMessage="Exportation en cours..."
        errorMessage="Erreur lors de l'exportation du fichier."
        fileType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      />
    </>
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
      actions={<ActionsPromotionsGroups />}
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
