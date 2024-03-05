import {Groups} from "@mui/icons-material";
import GroupList from "./GroupList";
import GroupShow from "./GroupShow";
import GroupCreate from "./GroupCreate";
import GroupEdit from "./GroupEdit";
import {
  CreateButton,
  ExportButton,
  FilterForm,
  TextFilter,
} from "../../ui/haToolbar";
import {useRole} from "../../security/hooks";

const groups = {
  list: GroupList,
  show: GroupShow,
  create: GroupCreate,
  edit: GroupEdit,
  icon: Groups,
  options: {label: "Groupes"},
};

export function GroupFilters() {
  const role = useRole();
  return (
    <>
      {role.isManager() && <CreateButton />}
      <ExportButton />
      <FilterForm>
        <TextFilter
          data-testid="filter-group-name"
          source="name"
          label={"Nom"}
        />
        <TextFilter
          data-testid="filter-group-ref"
          source="ref"
          label={"Référence"}
        />
        <TextFilter
          data-testid="filter-group-create_datetime"
          source="creation_datetime"
          label={"Date ou année"}
        />
      </FilterForm>
    </>
  );
}

export default groups;
