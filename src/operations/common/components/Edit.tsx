import {ReactNode} from "react";
import {EditProps, Edit as RaEdit} from "react-admin";
import {useNotify} from "../../../hooks";

type HaEditProps = EditProps & {children: ReactNode};

export const Edit = ({
  children,
  mutationOptions = {},
  ...editProps
}: Readonly<HaEditProps>) => {
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
};
