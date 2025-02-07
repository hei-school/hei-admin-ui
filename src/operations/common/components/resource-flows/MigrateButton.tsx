import {useToggle} from "@/hooks";
import {MAX_ITEM_PER_PAGE} from "@/providers/dataProvider";
import {Autocomplete} from "@/ui/components/inputs";
import {PersonRemove as MigrateIcon} from "@mui/icons-material";
import {Button, useGetList, useGetOne, useRecordContext} from "react-admin";
import {useForm} from "react-hook-form";
import {DialogActions} from "./components/DialogActions";
import {FlowsDialog, FlowsDialogProps} from "./components/FlowsDialog";
import {
  LabelFn,
  ResourceFlowsArgsType,
  ResourceIdentifier,
} from "./ResourceFlowsContext";
import {useResourceFlowsContext} from "./useResourceFlowsContext";

export type MigrateDialogProps<Child, Parent> = Omit<
  FlowsDialogProps,
  "title"
> & {
  title: LabelFn<Child>;
  onClose: () => void;
  autoCompleteLabel: string;
  showField: keyof Parent;
};

export type MigrateButtonProps<
  Child extends ResourceIdentifier,
  Parent extends ResourceIdentifier,
> = {
  label?: string;
  icon?: React.ReactElement;
  dialogProps: Omit<
    MigrateDialogProps<Child, Parent>,
    "open" | "onClose" | "excludes"
  >;
};

export type FormType = {
  resource: {id: string; label: string};
};

export function MigrateDialog<
  Child extends ResourceIdentifier,
  Parent extends ResourceIdentifier,
>({
  autoCompleteLabel,
  title,
  showField,
  ...dialogProps
}: MigrateDialogProps<Child, Parent>) {
  const {
    submit,
    parentResource,
    childResource,
    childGetOneOptions,
    parentGetListsOptions = {},
    parentId,
  } = useResourceFlowsContext();
  const {id: childId} = useRecordContext();
  const {data: child} = useGetOne<Child>(childResource, {
    id: childId,
    ...childGetOneOptions,
  });
  const {data: parents = [], isLoading: optionLoading} = useGetList<Parent>(
    parentResource,
    {
      pagination: {page: 1, perPage: MAX_ITEM_PER_PAGE - 1},
      ...parentGetListsOptions,
    }
  );

  const {control, handleSubmit} = useForm<FormType>({
    defaultValues: {
      resource: {id: "", label: ""},
    },
  });

  const parentOptions = parents
    .filter((el) => (el.id as string) !== parentId)
    .map((el) => ({
      id: el.id,
      label: el[showField] as string,
    })) as FormType["resource"][];

  const onSubmit = async ({resource: givenResources}: FormType) => {
    const args: ResourceFlowsArgsType<Child, Parent> = {
      type: "MIGRATE",
      resources: [child!],
      parent: parents.find((par) => par.id === givenResources!.id)!,
    };
    await submit({args, onSuccess: () => dialogProps.onClose()});
  };

  return (
    <FlowsDialog title={title(child!)} {...dialogProps}>
      <form
        style={{width: "100%", marginTop: "30px"}}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Autocomplete
          autoFocus
          filterSelectedOptions
          name="resource"
          data-testid="migrate-autocomplete"
          control={control}
          loading={optionLoading}
          options={parentOptions}
          inputLabel={autoCompleteLabel}
        />
        <DialogActions />
      </form>
    </FlowsDialog>
  );
}

export function MigrateButton<
  Child extends ResourceIdentifier,
  Parent extends ResourceIdentifier,
>({label, icon, dialogProps}: MigrateButtonProps<Child, Parent>) {
  const [isOpen, _set, toggle] = useToggle();
  return (
    <div>
      <Button
        startIcon={icon || <MigrateIcon />}
        label={label || "Migrer"}
        data-testid="migrate-button"
        onClick={(event) => {
          event.stopPropagation();
          toggle();
        }}
      />
      <MigrateDialog<Child, Parent>
        {...dialogProps}
        open={isOpen}
        onClose={toggle}
      />
    </div>
  );
}
