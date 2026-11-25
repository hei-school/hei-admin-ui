import {HaList} from "@/ui/haList";
import {RemoveRedEye} from "@mui/icons-material";
import {Button} from "@mui/material";
import {GraduationCap} from "lucide-react";
import {TextField, useRecordContext} from "react-admin";
import {Link} from "react-router-dom";
import {DateField} from "../common/components/fields";

const ShowOverviewButton = () => {
  const record = useRecordContext();

  if (!record) return null;

  return (
    <Button
      startIcon={<RemoveRedEye />}
      component={Link}
      to={`/promotions/${record.id}/show/students-result-overviews`}
    >
      Afficher
    </Button>
  );
};

export const PromotionOverviewList = () => {
  return (
    <HaList
      title="Liste des promotions"
      actions={undefined}
      resource="promotions"
      icon={<GraduationCap />}
      datagridProps={{
        rowClick: false,
      }}
    >
      <TextField source="name" label="Nom de la promotion" />
      <TextField source="ref" label="Référence" />
      <DateField source="creation_datetime" label="Date de création" />
      <ShowOverviewButton />
    </HaList>
  );
};
