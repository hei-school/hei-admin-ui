import {useState} from "react";
import {Button} from "react-admin";
import {Link as RouterLink, useLocation} from "react-router-dom";
import {
  MenuItem as MuiMenuItem,
  Menu,
  Divider,
  styled,
  Box,
  Link,
} from "@mui/material";
import {
  Download,
  Inventory,
  KeyboardArrowDown,
  CollectionsBookmark,
  LibraryAddCheck,
  Work,
} from "@mui/icons-material";
import {GetCertificate} from "@/operations/students/components";
import {PALETTE_COLORS} from "@/haTheme";
import {COMMON_OUTLINED_BUTTON_PROPS} from "@/ui/constants/common_styles";

const StyledMenu = styled((props) => (
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

const MenuItem = ({children, to, handleClose}) => {
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

export const DocMenu = ({studentId}) => {
  const [anchorEl, setAnchorEl] = useState(null);
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
        size="medium"
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
        <GetCertificate studentId={studentId} variant=" " />
      </StyledMenu>
    </Box>
  );
};
