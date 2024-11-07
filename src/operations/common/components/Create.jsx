import {Create as RaCreate} from "react-admin";
import {useNotify} from "../../../hooks";

export const Create = ({children, mutationOptions = {}, ...createProps}) => {
  const notify = useNotify();
  return (
    <RaCreate
      mutationMode="pessimistic"
      mutationOptions={{
        onError: (error) => {
          if (mutationOptions.onError) {
            mutationOptions.onError(error);
          } else {
            notify("Une erreur s'est produite", {
              type: "error",
            });
          }
        },
        ...mutationOptions,
      }}
      {...createProps}
    >
      {children}
    </RaCreate>
  );
};
