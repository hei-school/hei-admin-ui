import {Button, useGetList} from "react-admin";
import {Add as InsertIcon} from "@mui/icons-material";
import {useForm} from "react-hook-form";
import {
  ResourceFlowsArgsType,
  ResourceIdentifier,
} from "./ResourceFlowsContext";
import {HaActionWrapper} from "@/ui/haToolbar";
import {MultipleAutocomplete} from "@/ui/components/inputs";
import {DialogActions} from "./components/DialogActions";
import {FlowsDialog, FlowsDialogProps} from "./components/FlowsDialog";
import {useResourceFlowsContext} from "./useResourceFlowsContext";
import {useToggle} from "@/hooks";
import {MAX_ITEM_PER_PAGE} from "@/providers/dataProvider";

export type InsertDialogProps<T> = FlowsDialogProps & {
  onClose: () => void;
  autoCompleteLabel: string;
  showField: keyof T;
  excludes?: string[];
};

export type InsertButtonProps<T> = {
  label?: string;
  icon?: React.ReactElement;
  excludes: InsertDialogProps<T>["excludes"];
  dialogProps: Omit<InsertDialogProps<T>, "open" | "onClose" | "excludes">;
};

type FormType = {
  resources: [{id: string; label: string}];
};

export function InsertDialog<T extends ResourceIdentifier>({
  autoCompleteLabel,
  showField,
  excludes = [],
  ...dialogProps
}: InsertDialogProps<T>) {
  const {
    submit,
    childResource,
    childGetListsOptions = {},
  } = useResourceFlowsContext();
  const {data: childs = [], isLoading: optionLoading} = useGetList<T>(
    childResource,
    {
      pagination: {page: 1, perPage: MAX_ITEM_PER_PAGE - 1},
      ...childGetListsOptions,
    }
  );

  const {control, handleSubmit} = useForm<FormType>({
    defaultValues: {
      resources: [],
    },
  });

  const childOptions = childs
    .filter((el) => !excludes.includes(el.id as string))
    .map((el) => ({
      id: el.id,
      label: el[showField] as string,
    })) as FormType["resources"];

  const onSubmit = async ({resources: givenResources}: FormType) => {
    if (!givenResources || givenResources.length <= 0) {
      return;
    }
    const args: ResourceFlowsArgsType<T> = {
      type: "INSERT",
      resources: childs.filter((res) =>
        givenResources.map((el) => el.id).includes(res.id as string)
      ),
    };
    await submit({args, onSuccess: () => dialogProps.onClose()});
  };

  return (
    <FlowsDialog {...dialogProps}>
      <form
        style={{width: "100%", marginTop: "30px"}}
        onSubmit={handleSubmit(onSubmit)}
      >
        <MultipleAutocomplete
          autoFocus
          filterSelectedOptions
          name="resources"
          control={control}
          loading={optionLoading}
          options={childOptions}
          inputLabel={autoCompleteLabel}
        />
        <DialogActions />
      </form>
    </FlowsDialog>
  );
}

export function InsertButton<T extends ResourceIdentifier>({
  label,
  icon,
  excludes = [],
  dialogProps,
}: InsertButtonProps<T>) {
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
      <InsertDialog<T>
        {...dialogProps}
        open={isOpen}
        onClose={toggle}
        excludes={excludes}
      />
    </div>
  );
}
