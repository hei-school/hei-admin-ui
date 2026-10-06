import {PALETTE_COLORS} from "@/haTheme";
import {Box, Theme, Typography, useMediaQuery} from "@mui/material";
import {SystemStyleObject} from "@mui/system";
import {HTMLAttributeAnchorTarget, ReactNode} from "react";
import {Link, useSidebarState} from "react-admin";
import {useLocation} from "react-router-dom";

const style = {
  "display": "flex",
  "alignItems": "center",
  "cursor": "pointer",
  "gap": 2,
  ":hover": {color: PALETTE_COLORS.yellow},
};

const isActivePath = (pathname: string, to: string, exact?: boolean) =>
  exact ? pathname === to : pathname.startsWith(to);

interface SingleMenuBaseProps {
  label: string;
  icon: ReactNode;
  to?: string;
  menu?: boolean;
  exact?: boolean;
  sx?: SystemStyleObject<Theme>;
  onClick?: () => void;
}

export const SingleMenuBase = ({
  label,
  icon,
  to,
  exact,
  menu = true,
  sx = {},
  onClick,
  ...rest
}: Readonly<SingleMenuBaseProps>) => {
  const location = useLocation();
  const isSmall = useMediaQuery("(max-width:900px)");
  const isLarge = useMediaQuery("(min-width:1700px)");
  const [open, setOpen] = useSidebarState();

  const isActive = !!to && isActivePath(location.pathname, to, exact);
  const color = isActive ? PALETTE_COLORS.yellow : "inherit";

  const handlerClick = () => {
    onClick?.();
    if (to && isSmall) setOpen(!open);
  };

  return (
    <Box
      sx={{
        ...style,
        color,
        "pl": menu ? 0 : 2,
        "width": to ? "100%" : "fit-content",
        "& .MuiSvgIcon-root": {
          fontSize: menu ? "1.6rem !important" : "1.5rem !important",
        },
        ...sx,
        "paddingBlock": "1vh ",
        "display": "flex",
        "alignItems": "center",
      }}
      component="div"
      onClick={handlerClick}
      {...rest}
    >
      {icon}
      <Typography
        variant="h6"
        sx={{fontSize: isLarge ? "1.2em" : ".9em", color: "inherit"}}
      >
        {label}
      </Typography>
    </Box>
  );
};

interface SingleMenuProps {
  label: string;
  icon: ReactNode;
  to?: string;
  menu?: boolean;
  exact?: boolean;
  target?: HTMLAttributeAnchorTarget;
  onClick?: () => void;
}

export const SingleMenu = ({
  label,
  icon,
  to,
  menu,
  exact,
  target,
  onClick,
  ...rest
}: Readonly<SingleMenuProps>) =>
  to ? (
    <Link to={to} target={target} sx={{color: "inherit"}}>
      <SingleMenuBase {...{label, icon, to, exact, menu, onClick, ...rest}} />
    </Link>
  ) : (
    <SingleMenuBase {...{label, icon, to, exact, menu, onClick, ...rest}} />
  );
