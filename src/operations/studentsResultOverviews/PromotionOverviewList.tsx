import {HaList} from "@/ui/haList";
import {GraduationCap} from "lucide-react";
import {TextField} from "react-admin";
import {useNavigate} from "react-router-dom";
import {DateField} from "../common/components/fields";

export const PromotionOverviewList = () => {
  const navigate = useNavigate();

  return (
    <HaList
      title="Liste des promotions"
      actions={undefined}
      resource="promotions"
      icon={<GraduationCap />}
      datagridProps={{
        rowClick: (promotionId: string) => {
          navigate(`/promotions/${promotionId}/show/students-result-overviews`);
          return false;
        },
      }}
    >
      <TextField source="name" label="Nom de la promotion" />
      <TextField source="ref" label="Référence de la promotion" />
      <DateField source="creation_datetime" label="Date de création" />
    </HaList>
  );
};
