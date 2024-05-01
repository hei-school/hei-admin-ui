import {useContext} from "react";
import {
  RESOURCE_FLOWS_CONTEXT,
  ResourceFlowsContextType,
  ResourceIdentifier,
} from "./ResourceFlowsContext";

export function useResourceFlowsContext<T extends ResourceIdentifier>() {
  const value = useContext(RESOURCE_FLOWS_CONTEXT);

  if (value === null) {
    throw new Error("Flows context value not provided");
  }

  return value as ResourceFlowsContextType<T>;
}
