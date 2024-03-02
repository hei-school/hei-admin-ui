import {Edit as _Edit} from "react-admin";
import {useNotify} from "../../../hooks";

export function Edit({children, ...editProps}) {
  const notify = useNotify();
  return (
    <_Edit
      mutationMode="pessimistic"
      mutationOptions={{
        onError: () => {
          notify(`Une erreur s'est produite`, {
            type: "error",
          });
        },
      }}
      {...editProps}
    >
      {children}
    </_Edit>
  );
}
