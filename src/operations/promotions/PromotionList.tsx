import {useToggle} from "@/hooks";
import {Dialog} from "@/ui/components";
import {HaList} from "@/ui/haList";
import {ButtonBase, HaActionWrapper} from "@/ui/haToolbar";
import {Add, MenuBook as PromotionIcon} from "@mui/icons-material";
import {ShowButton, TextField} from "react-admin";
import {DateField} from "../common/components/fields";
import {PromotionListFilter} from "./components";
import {PromotionCreate} from "./PromotionCreate";

export default function PromotionList() {
  const [showCreate, _set, toggleShowCreate] = useToggle();

  return (
    <>
      <HaList
        title="Promotions"
        resource="promotions"
        icon={<PromotionIcon />}
        mainSearch={{
          source: "name",
          label: "Nom",
        }}
        actions={
          <HaActionWrapper>
            <ButtonBase
              data-testid="create-button"
              icon={<Add />}
              onClick={toggleShowCreate}
              closeAction
            >
              Créer
            </ButtonBase>
            <PromotionListFilter />
          </HaActionWrapper>
        }
      >
        <TextField source="name" label="Nom" />
        <TextField source="ref" label="Référence" />
        <DateField label="Date de création" source="creation_datetime" />
        <ShowButton />
      </HaList>
      <Dialog
        title="Création d'une promotion"
        onClose={toggleShowCreate}
        open={showCreate}
      >
        <PromotionCreate />
      </Dialog>
    </>
  );
}
