import { createContext } from "react";
import { AxiosError } from "axios";
import { Identifier } from "react-admin";

export type ResourceMigrateType = "JOIN" | "LEAVE" | "INSERT";
export type ResourceIdentifier = { id: string | Identifier | number };
export type LabelFn<T> = (record: T) => string;

export type ResourceFlowsArgsType<T extends ResourceIdentifier> = {
  resources: T[],
  type: ResourceMigrateType,
}

export type ResourceFlowsContextType<T extends ResourceIdentifier> = {
  resource: string;
  provider: (args: ResourceFlowsArgsType<T>) => Promise<T>;
  onSuccess: (args: ResourceFlowsArgsType<T>) => void;
  onError: (args: ResourceFlowsArgsType<T> & { error: AxiosError<unknown> }) => void;
};

export const RESOURCE_FLOWS_CONTEXT = createContext<ResourceFlowsContextType<any> | null>(null);

export function ResourceFlowsContext<T extends ResourceIdentifier>({ children, ...contextProps }: ResourceFlowsContextType<T> & { children: React.ReactNode }) {
  return (
    <RESOURCE_FLOWS_CONTEXT.Provider value={contextProps as ResourceFlowsContextType<any>}>
      {children}
    </RESOURCE_FLOWS_CONTEXT.Provider>
  )
}
