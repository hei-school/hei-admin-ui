import {Edit as RaEdit} from "react-admin";
import {useNotify} from "../../../hooks";

export function Edit({children, mutationOptions = {}, ...editProps}) {
  const notify = useNotify();
  return (
    <RaEdit
      mutationMode="pessimistic"
      mutationOptions={{
        onError: () => {
          notify(`Une erreur s'est produite`, {
            type: "error",
          });
        },
        ...mutationOptions,
      }}
      {...editProps}
    >
      {children}
    </RaEdit>
  );
}
