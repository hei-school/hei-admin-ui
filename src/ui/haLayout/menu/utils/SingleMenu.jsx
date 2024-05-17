import {Box, Typography} from "@mui/material";
import {useMediaQuery} from "@mui/material";
import {PALETTE_COLORS} from "@/haTheme";
import {Link, useSidebarState} from "react-admin";
import {useLocation} from "react-router-dom";

const style = {
  "display": "flex",
  "alignItems": "center",
  "cursor": "pointer",
  "gap": 2,
  ":hover": {color: PALETTE_COLORS.yellow},
};
export function SingleMenuBase({
  label,
  icon,
  to,
  menu = true,
  sx = {},
  ...rest
}) {
  const location = useLocation();
  const isSmall = useMediaQuery("(max-width:900px)");
  const [open, setOpen] = useSidebarState();
  const color =
    to && location.pathname.startsWith(to) ? PALETTE_COLORS.yellow : "inherit";

  const handlerClick = () => {
    if (to && isSmall) setOpen(!open);
  };

  return (
    <Box
      sx={{
        ...style,
        color,
        "pl": menu ? 0 : 2,
        "mb": menu ? 3 : 1.5,
        "width": to ? "100%" : "fit-content",
        "& .MuiSvgIcon-root": {
          fontSize: menu ? "1.6rem !important" : "1.5rem !important",
        },
        ...sx,
      }}
      component="div"
      onClick={handlerClick}
      {...rest}
    >
      {icon}
      <Typography variant="h6" sx={{fontSize: ".9em", color: "inherit"}}>
        {label}
      </Typography>
    </Box>
  );
}

export const SingleMenu = ({label, icon, to, menu, ...rest}) =>
  to ? (
    <Link to={to} sx={{color: "inherit"}}>
      <SingleMenuBase {...{label, icon, to, menu, ...rest}} />
    </Link>
  ) : (
    <SingleMenuBase {...{label, icon, to, menu, ...rest}} />
  );
