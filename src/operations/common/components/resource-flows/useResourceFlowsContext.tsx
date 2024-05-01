import {useContext} from "react";
import {
  ResourceFlowsContextType,
  ResourceIdentifier,
  RESOURCE_FLOWS_CONTEXT,
} from "./ResourceFlowsContext";

export function useResourceFlowsContext<
  Child extends ResourceIdentifier,
  Parent extends ResourceIdentifier,
>() {
  const value = useContext(RESOURCE_FLOWS_CONTEXT);
  return value as ResourceFlowsContextType<Child, Parent>;
}
