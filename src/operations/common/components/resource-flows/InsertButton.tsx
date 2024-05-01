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
import useHaListContext from "@/ui/haList/useHaListContext";

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

export function InsertDialog<
  Child extends ResourceIdentifier,
  Parent extends ResourceIdentifier,
>({
  autoCompleteLabel,
  showField,
  excludes = [],
  ...dialogProps
}: InsertDialogProps<Child>) {
  const {
    submit,
    childResource,
    childGetListsOptions = {},
  } = useResourceFlowsContext<Child, Parent>();
  const {data: childs = [], isLoading: optionLoading} = useGetList<Child>(
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
    const args: ResourceFlowsArgsType<Child, Parent> = {
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

export function InsertButton<
  Child extends ResourceIdentifier,
  Parent extends ResourceIdentifier = any,
>({label, icon, excludes = [], dialogProps}: InsertButtonProps<Child>) {
  const [isOpen, _set, toggle] = useToggle();
  const {closeAction: closeListPopover} = useHaListContext();

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
      <InsertDialog<Child, Parent>
        {...dialogProps}
        open={isOpen}
        excludes={excludes}
        onClose={() => {
          toggle();
          closeListPopover();
        }}
      />
    </div>
  );
}
