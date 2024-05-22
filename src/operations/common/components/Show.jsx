import {Show as RaShow} from "react-admin";

export const Show = ({children, sx = {}, ...props}) => {
  return (
    <RaShow
      sx={{
        ...sx,
        m: "auto",
        width: "80%",
      }}
      {...props}
    >
      {children}
    </RaShow>
  );
};
