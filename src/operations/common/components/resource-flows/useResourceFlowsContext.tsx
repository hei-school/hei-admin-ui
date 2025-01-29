import {useContext} from "react";
import {
  RESOURCE_FLOWS_CONTEXT,
  ResourceFlowsContextType,
  ResourceIdentifier,
} from "./ResourceFlowsContext";

export function useResourceFlowsContext<
  Child extends ResourceIdentifier,
  Parent extends ResourceIdentifier,
>() {
  const value = useContext(RESOURCE_FLOWS_CONTEXT);
  return value as ResourceFlowsContextType<Child, Parent>;
}
