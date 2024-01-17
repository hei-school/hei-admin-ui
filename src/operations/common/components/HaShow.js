import {Show} from "react-admin";

export const HaShow = ({children, ...props}) => {
  return (
    <Show
      {...props}
      sx={{
        "& .RaShow-card": {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      {children}
    </Show>
  );
};
