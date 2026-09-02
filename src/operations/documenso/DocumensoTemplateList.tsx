import {HaList} from "@/ui/haList";
import {TemplateDocumenso} from "@haapi-3d601c85/typescript-client";
import {HistoryEdu as DocumensoIcon} from "@mui/icons-material";
import {TextField} from "react-admin";

const ROW_SX = {"& tbody .MuiTableRow-root": {cursor: "pointer"}};

export const DocumensoTemplateList = ({
  onSelect,
}: {
  onSelect: (template: TemplateDocumenso) => void;
}) => (
  <HaList
    resource="documenso-templates"
    title="Modèles de fiches"
    icon={<DocumensoIcon />}
    emptyListMessage="Aucun modèle synchronisé depuis Documenso"
    actions={undefined}
    listProps={{title: " "}}
    datagridProps={{
      "rowClick": (
        _id: string,
        _resource: string,
        record: TemplateDocumenso
      ) => {
        onSelect(record);
        return false;
      },
      "sx": ROW_SX,
      "data-testid": "documenso-templates-list",
    }}
  >
    <TextField source="title" label="Modèle" sortable={false} />
    <TextField source="type" label="Type" sortable={false} />
  </HaList>
);
