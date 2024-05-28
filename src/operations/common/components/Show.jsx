import {Show as RaShow} from "react-admin";

export const Show = ({children, sx = {}, ...props}) => {
  return (
    <RaShow
      sx={{
        ...sx,
        m: "auto",
        width: "calc(100% - 20px",
      }}
      {...props}
    >
      {children}
    </RaShow>
  );
};
