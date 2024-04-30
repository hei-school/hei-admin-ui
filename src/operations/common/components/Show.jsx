import { Show as RaShow } from "react-admin";

export const Show = ({ children, sx = {}, ...props }) => {
  return (
    <RaShow
      sx={{
        ...sx,
        "& .RaShow-card": {
          backgroundColor: "transparent",
          boxShadow: "none",
          zIndex: 999,
        },
      }}
      {...props}
    >
      {children}
    </RaShow>
  );
};
