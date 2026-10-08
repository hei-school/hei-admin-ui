import {PALETTE_COLORS} from "@/haTheme";
import {GetCertificate} from "@/operations/students/components";
import {COMMON_OUTLINED_BUTTON_PROPS} from "@/ui/constants/common_styles";
import {
  CollectionsBookmark,
  Inventory,
  KeyboardArrowDown,
  LibraryAddCheck,
  Work,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Link,
  Menu,
  MenuProps,
  MenuItem as MuiMenuItem,
  styled,
} from "@mui/material";
import {ReactNode, useState} from "react";
import {Button} from "react-admin";
import {Link as RouterLink, useLocation} from "react-router-dom";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({theme}) => ({
  "& .MuiPaper-root": {
    "borderRadius": 6,
    "marginTop": theme.spacing(1),
    "minWidth": 180,
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        marginRight: theme.spacing(1.5),
      },
    },
  },
}));

type MenuItemProps = {
  children: ReactNode;
  to: string;
  handleClose: () => void;
};

const MenuItem = ({children, to, handleClose}: Readonly<MenuItemProps>) => {
  return (
    <Link
      to={to}
      component={RouterLink}
      underline="none"
      color={PALETTE_COLORS.typography.black}
    >
      <MuiMenuItem onClick={handleClose} disableRipple>
        {children}
      </MuiMenuItem>
    </Link>
  );
};

export type DocMenuProps = {
  studentId: string;
};

export const DocMenu = ({studentId}: Readonly<DocMenuProps>) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const location = useLocation();

  const open = Boolean(anchorEl);

  // get the path without /show
  const path = location.pathname.split("/").slice(0, -1).join("/");

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Button
        id="docs-button"
        data-testid="docs-button"
        label="Documents"
        aria-controls={open ? "docs-menu" : undefined}
        aria-haspopup
        aria-expanded={open ? "true" : undefined}
        disableElevation
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
        }}
        endIcon={<KeyboardArrowDown />}
        {...COMMON_OUTLINED_BUTTON_PROPS}
      >
        <Inventory />
      </Button>
      <StyledMenu
        id="docs-menu"
        MenuListProps={{
          "aria-labelledby": "docs-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          to={`${path}/docs/students/TRANSCRIPT`}
          handleClose={handleClose}
        >
          <CollectionsBookmark />
          Bulletins
        </MenuItem>
        <MenuItem
          to={`${path}/docs/students/WORK_DOCUMENT`}
          handleClose={handleClose}
        >
          <LibraryAddCheck />
          Validations d'expériences professionnelles
        </MenuItem>
        <MenuItem to={`${path}/docs/students/OTHER`} handleClose={handleClose}>
          <Work />
          Autres
        </MenuItem>
        <Divider sx={{my: 0.5}} />
        {/* " " matches no MUI variant style: kept as is to preserve the current rendering */}
        <GetCertificate studentId={studentId} variant=" " />
      </StyledMenu>
    </Box>
  );
};
