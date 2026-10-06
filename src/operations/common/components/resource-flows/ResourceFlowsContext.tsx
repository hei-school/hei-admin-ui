import {AxiosError} from "axios";
import {createContext, useCallback, useMemo, useState} from "react";
import {
  GetListParams,
  GetOneParams,
  Identifier,
  useListContext,
} from "react-admin";
import {useQueryClient} from "react-query";

export type ResourceMigrateType = "MIGRATE" | "LEAVE" | "INSERT";
export type ResourceIdentifier = {id: string | Identifier | number};
export type LabelFn<T> = (record: T) => string;

export type ResourceFlowsArgsType<
  Child extends ResourceIdentifier,
  Parent extends ResourceIdentifier,
> = {resources: Child[]} & (
  | {
      type: "MIGRATE";
      parent: Parent;
    }
  | {
      type: "LEAVE" | "INSERT";
      parent?: never;
    }
);

export type ResourceFlowsContextType<
  Child extends ResourceIdentifier,
  Parent extends ResourceIdentifier,
> = {
  isLoading: boolean;
  parentId: string;
  parentResource: string;
  childResource: string;
  childGetListsOptions?: GetListParams;
  childGetOneOptions?: GetOneParams;
  parentGetListsOptions?: GetListParams;
  parentGetOneOptions?: GetOneParams;
  submit: (state: {
    args: ResourceFlowsArgsType<Child, Parent>;
    onSuccess: () => void;
  }) => Promise<void>;
  setIsLoading: (state: boolean) => void;
  provider: (args: ResourceFlowsArgsType<Child, Parent>) => Promise<unknown>;
  onSuccess: (args: ResourceFlowsArgsType<Child, Parent>) => void;
  onError: (
    args: ResourceFlowsArgsType<Child, Parent> & {error: AxiosError<unknown>}
  ) => void;
};

// Child and Parent only type the arguments the context receives: a context
// typed for whatever resources fits in ResourceFlowsContextType<never, never>
export const RESOURCE_FLOWS_CONTEXT = createContext<ResourceFlowsContextType<
  never,
  never
> | null>(null);

const ResourceFlowsProvider = RESOURCE_FLOWS_CONTEXT.Provider;

export const ResourceFlowsContext = <
  Child extends ResourceIdentifier,
  Parent extends ResourceIdentifier,
>({
  children,
  ...contextProps
}: Omit<
  ResourceFlowsContextType<Child, Parent>,
  "submit" | "setIsLoading" | "isLoading"
> & {children: React.ReactNode}) => {
  const [isLoading, setIsLoading] = useState(false);
  const {resource} = useListContext();
  const queryClient = useQueryClient();

  const submit = useCallback(
    async ({
      onSuccess,
      args,
    }: {
      onSuccess?: () => void;
      args: ResourceFlowsArgsType<Child, Parent>;
    }) => {
      try {
        setIsLoading(true);
        await contextProps.provider(args);
        contextProps.onSuccess(args);
        void queryClient.invalidateQueries(resource);
        onSuccess?.();
      } catch (error) {
        contextProps.onError({...args, error: error as AxiosError<unknown>});
      } finally {
        setIsLoading(false);
      }
    },
    [contextProps, queryClient, resource]
  );

  const contextValue = useMemo(
    (): ResourceFlowsContextType<Child, Parent> => ({
      ...contextProps,
      isLoading,
      setIsLoading,
      submit,
    }),
    [contextProps, isLoading, submit]
  );

  return (
    <ResourceFlowsProvider value={contextValue}>
      {children}
    </ResourceFlowsProvider>
  );
};
