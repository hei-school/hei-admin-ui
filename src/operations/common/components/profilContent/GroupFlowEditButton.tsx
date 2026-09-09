import {useNotify, useToggle} from "@/hooks";
import studentGroupFlowProvider from "@/providers/studentGroupFlowProvider";
import {Dialog} from "@/ui/components";
import {GroupFlow} from "@haapi-b0fc7615/typescript-client";
import {Edit as EditIcon} from "@mui/icons-material";
import {IconButton, Tooltip} from "@mui/material";
import {useState} from "react";
import {
  DateTimeInput,
  required,
  SaveButton,
  SelectInput,
  SimpleForm,
  Toolbar,
  useGetList,
  useRefresh,
} from "react-admin";

interface GroupFlowEditButtonProps {
  record: GroupFlow;
}

export const GroupFlowEditButton = ({record}: GroupFlowEditButtonProps) => {
  const [showEdit, , toggleEdit] = useToggle();
  const [isLoading, setIsLoading] = useState(false);
  const notify = useNotify();
  const refresh = useRefresh();
  const {data: groups = []} = useGetList("groups");

  const groupChoices = groups.map(({id, ref = ""}) => ({id, ref}));

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      await studentGroupFlowProvider.saveOrUpdate([
        {
          id: record.id,
          group_id: values.group_id,
          flow_datetime: values.flow_datetime,
        },
      ]);
      notify("Historique de groupe modifié avec succès", {type: "success"});
      toggleEdit();
      refresh();
    } catch {
      notify("Erreur lors de la mise à jour de l'historique", {
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Tooltip
        data-testid="edit-group-flow"
        title="Éditer"
        onClick={toggleEdit}
        sx={{cursor: "pointer"}}
      >
        <IconButton size="small">
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Dialog
        title="Éditer l'historique de groupe"
        open={showEdit}
        onClose={toggleEdit}
      >
        <SimpleForm
          onSubmit={handleSubmit}
          defaultValues={{
            group_id: record.group_id,
            flow_datetime: record.flow_datetime,
          }}
          toolbar={
            <Toolbar>
              <SaveButton data-testid="save-group-flow" disabled={isLoading} />
            </Toolbar>
          }
        >
          <SelectInput
            data-testid="group-flow-group-select"
            source="group_id"
            label="Groupe"
            choices={groupChoices}
            optionValue="id"
            optionText="ref"
            validate={required()}
            fullWidth
          />
          <DateTimeInput
            source="flow_datetime"
            label="Date du mouvement"
            validate={required()}
            fullWidth
          />
        </SimpleForm>
      </Dialog>
    </>
  );
};
