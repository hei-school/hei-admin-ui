import {Create as _Create} from "react-admin";
import {useNotify} from "../../../hooks";

export const Create = ({children, mutationOptions = {}, ...createProps}) => {
  const notify = useNotify();
  return (
    <_Create
      mutationMode="pessimistic"
      mutationOptions={{
        onError: () => {
          notify("Une erreur s'est produite", {
            type: "error",
          });
        },
        ...mutationOptions,
      }}
      {...createProps}
    >
      {children}
    </_Create>
  );
};
