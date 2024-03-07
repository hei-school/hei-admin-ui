import {Create, useNotify} from "react-admin";

export const CustomCreate = ({children, mutationOptions = {}, ...props}) => {
  const notify = useNotify();
  return (
    <Create
      mutationMode="pessimistic"
      mutationOptions={{
        onMutate: () => {
          notify(`En cours de création...`, {
            type: "info",
            autoHideDuration: 1000,
          });
        },
        onError: (error) => {
          notify(`Une erreur s'est produite`, {
            type: "error",
            autoHideDuration: 1000,
          });
        },
        ...mutationOptions,
      }}
      {...props}
    >
      {children}
    </Create>
  );
};
