import {Show as RaShow, ShowProps} from "react-admin";

// basePath no longer exists in react-admin v4, but some callers still pass it
type HaShowProps = ShowProps & {basePath?: string};

export const Show = ({children, sx = {}, ...props}: Readonly<HaShowProps>) => {
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
