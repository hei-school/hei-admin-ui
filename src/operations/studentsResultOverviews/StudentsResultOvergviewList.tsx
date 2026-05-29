import {HaList} from "@/ui/haList";
import {ResultOverviewStatus} from "@haapi-b0fc7615/typescript-client";
import {BookOpenCheckIcon} from "lucide-react";
import {TextField} from "react-admin";
import {useParams} from "react-router-dom";

const StudentsResultOverviews = () => {
  const status = ResultOverviewStatus.VALIDATED;
  const {promotionId} = useParams<{promotionId: string}>();
  if (!promotionId) return null;

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
        label: "Référence ex : STD23097",
      }}
      listProps={{
        filter: {promotionId, status},
      }}
      actions={undefined}
    >
      <TextField source="ref" label="Référence" />
      <TextField source="last_name" label="Nom" />
      <TextField source="first_name" label="Prénom(s)" />
      <TextField source="email" label="Email" />
      <TextField source="weighted_average" label="Moyenne générale" />
      <TextField source="obtained_credits" label="Crédits obtenus" />
    </HaList>
  );
};

export default StudentsResultOverviews;
