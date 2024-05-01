import { Button, useGetList, useListContext } from "react-admin";
import { SxProps, DialogProps, Button as MuiButton, DialogActions as MuiDialogActions, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { Add as InsertIcon } from "@mui/icons-material";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";

import { ResourceFlowsArgsType, ResourceIdentifier } from "./ResourceFlowsContext";
import { HaActionWrapper } from "@/ui/haToolbar";
import { MultipleAutocomplete } from "@/ui/components/inputs";
import { useResourceFlowsContext } from "./useResourceFlowsContext";
import { useToggle } from "@/hooks";
import { PALETTE_COLORS } from "@/ui/constants";
import { MAX_ITEM_PER_PAGE } from "@/providers/dataProvider";

export type InsertDialogProps<T> = DialogProps & {
  onClose: () => void;
  title: string;
  autoCompleteLabel: string;
  showField: keyof T;
};

export type InsertButtonProps<T> = {
  label?: string;
  icon?: React.ReactElement;
  dialogProps: Omit<InsertDialogProps<T>, "open" | "onClose">
}

type FormType = {
  resource: [{ id: string, label: string }];
}

const DIALOG_TITLE_STYLE: SxProps = {
  color: PALETTE_COLORS.white,
  py: 2,
  fontSize: "18px",
};

function DialogActions() {
  return (
    <MuiDialogActions>
      <MuiButton
        type="submit"
        fullWidth
        sx={{
          "bgcolor": PALETTE_COLORS.primary,
          "color": PALETTE_COLORS.white,
          transition: "all .5s linear",
          opacity: .9,
          m: 0,
          "&:hover": {
            "bgcolor": PALETTE_COLORS.primary,
            opacity: 1
          },
        }}
      >
        Envoyer
      </MuiButton>
    </MuiDialogActions>
  );
};

export function InsertDialog<T extends ResourceIdentifier>({ title, autoCompleteLabel, showField, ...dialogProps }: InsertDialogProps<T>) {
  const { resource: resourceName, provider, onError, onSuccess } = useResourceFlowsContext();
  const listContext = useListContext();
  const { data: resources = [], isLoading } = useGetList<T>(resourceName, { pagination: { page: 1, perPage: MAX_ITEM_PER_PAGE - 1 } });
  const { control, handleSubmit } = useForm<FormType>({
    defaultValues: {
      resource: []
    },
  });

  const takenResourcesIds = listContext.data.map((el: T) => el.id);
  const resourcesOptions = resources
    .filter(el => !takenResourcesIds.includes(el.id))
    .map(el => ({ id: el.id, label: el[showField] as string })) as FormType["resource"];

  const onSubmit = async ({ resource }: FormType) => {
    const args: ResourceFlowsArgsType<T> = {
      type: "INSERT",
      resources: resources.filter(el => resource.map(res => res.id).includes(el.id as string))
    };

    try {
      await provider(args);
      onSuccess(args);
      dialogProps.onClose();
    } catch (error) {
      onError({ ...args, error: error as AxiosError<unknown> });
    }
  };

  return (
    <Dialog maxWidth="sm" fullWidth {...dialogProps}>
      <DialogTitle
        variant="h2"
        sx={{
          bgcolor: PALETTE_COLORS.primary,
          opacity: .9,
          ...DIALOG_TITLE_STYLE
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <form style={{ width: "100%", marginTop: "30px" }} onSubmit={handleSubmit(onSubmit)}>
          <MultipleAutocomplete
            autoFocus
            filterSelectedOptions
            name="resource"
            control={control}
            loading={isLoading}
            options={resourcesOptions}
            inputLabel={autoCompleteLabel}
          />
          <DialogActions />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export function InsertButton<T extends ResourceIdentifier>({ label, icon, dialogProps }: InsertButtonProps<T>) {
  const [isOpen, _set, toggle] = useToggle();
  return (
    <div>
      <HaActionWrapper>
        <Button
          size="large"
          startIcon={icon || <InsertIcon />}
          onClick={toggle}
          label={label || "Insérer"}
        />
      </HaActionWrapper>
      <InsertDialog<T> {...{ ...dialogProps, open: isOpen, onClose: toggle }} />
    </div>
  );
};
