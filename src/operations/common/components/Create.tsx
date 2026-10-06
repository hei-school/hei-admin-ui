import {ReactNode} from "react";
import {CreateProps, Create as RaCreate} from "react-admin";
import {useNotify} from "../../../hooks";

type HaCreateProps = CreateProps & {children: ReactNode};

export const Create = ({
  children,
  mutationOptions = {},
  ...createProps
}: Readonly<HaCreateProps>) => {
  const notify = useNotify();
  return (
    <RaCreate
      mutationOptions={{
        onError: (error, variables, context) => {
          if (mutationOptions.onError) {
            mutationOptions.onError(error, variables, context);
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
