import {ShowButton, TextField} from "react-admin";
import {MenuBook as PromotionIcon, Add} from "@mui/icons-material";
import {HaList} from "@/ui/haList";
import {ButtonBase, HaActionWrapper} from "@/ui/haToolbar";
import {DateField} from "../common/components/fields";
import {PromotionDialog} from "./components";
import {PromotionCreate} from "./PromotionCreate";
import {useToggle} from "@/hooks";

export default function PromotionList() {
  const [showCreate, _set, toggleShowCreate] = useToggle();

  return (
    <>
      <HaList
        title="Promotions"
        resource="promotions"
        icon={<PromotionIcon />}
        actions={
          <HaActionWrapper>
            <ButtonBase icon={<Add />} onClick={toggleShowCreate} closeAction>
              Créer
            </ButtonBase>
          </HaActionWrapper>
        }
      >
        <TextField source="name" label="Nom" />
        <TextField source="ref" label="Référence" />
        <DateField label="Date de création" source="creation_datetime" />
        <ShowButton />
      </HaList>
      <PromotionDialog
        title="Création d'une promotion"
        onClose={toggleShowCreate}
        open={showCreate}
      >
        <PromotionCreate />
      </PromotionDialog>
    </>
  );
}
