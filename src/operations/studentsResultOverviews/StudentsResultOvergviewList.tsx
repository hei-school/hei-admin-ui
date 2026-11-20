import {FileDownloader} from "@/operations/common/components";
import {HaList} from "@/ui/haList";
import {ResultOverviewStatus} from "@haapi-3d601c85/typescript-client";
import {Download} from "@mui/icons-material";
import {BookOpenCheckIcon} from "lucide-react";
import {TextField, useDataProvider} from "react-admin";
import {useParams} from "react-router-dom";

const StudentsResultOverviews = () => {
  const status = ResultOverviewStatus.VALIDATED;
  const {promotionId} = useParams<{promotionId: string}>();
  const dataProvider = useDataProvider();
  if (!promotionId) return null;

  const downloadFile = async () => {
    const {
      data: {file},
    } = await dataProvider.getOne("students-result-overviews-export", {
      id: promotionId,
      meta: {status},
    });
    return {data: file};
  };

  return (
    <HaList
      title="Liste des sortants"
      resource="students-result-overviews"
      icon={<BookOpenCheckIcon />}
      datagridProps={{
        rowClick: false,
      }}
      mainSearch={{
        source: "ref",
        label: "Référence (STDXXXXX)",
      }}
      listProps={{
        title: "Résultats des sortants",
        filter: {promotionId, status},
      }}
      actions={undefined}
      directActions={
        <FileDownloader
          downloadFunction={downloadFile}
          fileName="Liste des sortants.xlsx"
          startIcon={<Download />}
          buttonText="Télécharger"
          successMessage="Téléchargement en cours..."
          errorMessage="Erreur lors du téléchargement du fichier."
          fileType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        />
      }
    >
      <TextField source="student.ref" label="Référence" />
      <TextField source="student.last_name" label="Nom" />
      <TextField source="student.first_name" label="Prénom(s)" />
      <TextField source="student.email" label="Email" />
      <TextField
        source="results_overview.weighted_average"
        label="Moyenne générale"
      />
      <TextField
        source="results_overview.obtained_credits"
        label="Crédits obtenus"
      />
    </HaList>
  );
};

export default StudentsResultOverviews;
