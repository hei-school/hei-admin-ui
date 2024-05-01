import {AxiosError} from "axios";
import {Identifier, useListContext} from "react-admin";
import {useQueryClient} from "react-query";
import {createContext, useState} from "react";

export type ResourceMigrateType = "JOIN" | "LEAVE" | "INSERT";
export type ResourceIdentifier = {id: string | Identifier | number};
export type LabelFn<T> = (record: T) => string;

export type ResourceFlowsArgsType<T extends ResourceIdentifier> = {
  resources: T[];
  type: ResourceMigrateType;
};

export type ResourceFlowsContextType<T extends ResourceIdentifier> = {
  resource: string;
  isLoading: boolean;
  submit: (state: {
    args: ResourceFlowsArgsType<T>;
    onSuccess: () => void;
  }) => Promise<void>;
  setIsLoading: (state: boolean) => void;
  provider: (args: ResourceFlowsArgsType<T>) => Promise<T>;
  onSuccess: (args: ResourceFlowsArgsType<T>) => void;
  onError: (
    args: ResourceFlowsArgsType<T> & {error: AxiosError<unknown>}
  ) => void;
};

export const RESOURCE_FLOWS_CONTEXT =
  createContext<ResourceFlowsContextType<any> | null>(null);

export function ResourceFlowsContext<T extends ResourceIdentifier>({
  children,
  ...contextProps
}: Omit<
  ResourceFlowsContextType<T>,
  "submit" | "setIsLoading" | "isLoading"
> & {children: React.ReactNode}) {
  const [isLoading, setIsLoading] = useState(false);
  const {resource} = useListContext();
  const queryClient = useQueryClient();

  const submit = async ({
    onSuccess,
    args,
  }: {
    onSuccess?: () => void;
    args: ResourceFlowsArgsType<T>;
  }) => {
    try {
      setIsLoading(true);
      await contextProps.provider(args);
      contextProps.onSuccess(args);
      queryClient.invalidateQueries(resource);
      onSuccess && onSuccess();
    } catch (error) {
      contextProps.onError({...args, error: error as AxiosError<unknown>});
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RESOURCE_FLOWS_CONTEXT.Provider
      value={
        {
          ...contextProps,
          isLoading,
          setIsLoading,
          submit,
        } as ResourceFlowsContextType<any>
      }
    >
      {children}
    </RESOURCE_FLOWS_CONTEXT.Provider>
  );
}
