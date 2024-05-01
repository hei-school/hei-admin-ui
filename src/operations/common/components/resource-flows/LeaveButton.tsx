import {
  Button,
  Confirm,
  ConfirmProps,
  useGetOne,
  useRecordContext,
} from "react-admin";
import {Delete as RemoveIcon} from "@mui/icons-material";
import {Typography} from "@mui/material";

import {
  LabelFn,
  ResourceFlowsArgsType,
  ResourceIdentifier,
} from "./ResourceFlowsContext";
import {useToggle} from "@/hooks";
import {useResourceFlowsContext} from "./useResourceFlowsContext";

export type LeaveDialogProps<T> = Partial<Omit<ConfirmProps, "title">> & {
  onClose: () => void;
  title: LabelFn<T>;
};
export type LeaveButtonProps<T> = {
  dialogProps: Omit<LeaveDialogProps<T>, "onClose">;
  label?: string;
  icon?: React.ReactElement;
};

function LeaveDialog<T extends ResourceIdentifier>({
  title,
  ...confirmProps
}: LeaveDialogProps<T>) {
  const {submit, resource: resourceName} = useResourceFlowsContext<T>();
  const {id: resourceId} = useRecordContext();
  const {data: resource} = useGetOne(resourceName, {id: resourceId});
  const args: ResourceFlowsArgsType<T> = {type: "LEAVE", resources: [resource]};

  const deleteResource = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    await submit({args, onSuccess: () => confirmProps.onClose(event)});
  };

  return (
    <Confirm
      {...confirmProps}
      title={<Typography>{title(resource)}</Typography>}
      content={
        <Typography variant="caption" color="red">
          * Cette action est irréversible.
        </Typography>
      }
      fullWidth
      maxWidth="sm"
      onConfirm={deleteResource}
    />
  );
}

export function LeaveButton<T extends ResourceIdentifier>({
  label,
  icon,
  dialogProps,
}: LeaveButtonProps<T>) {
  const [isOpen, _set, toggle] = useToggle();

  return (
    <div>
      <Button
        label={label || "Retirer"}
        startIcon={icon || <RemoveIcon />}
        onClick={(event) => {
          event.stopPropagation();
          toggle();
        }}
        sx={{
          color: "red",
        }}
      />
      <LeaveDialog<T> {...{...dialogProps, onClose: toggle, isOpen}} />
    </div>
  );
}
