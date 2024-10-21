import {Link} from "react-admin";
import {IconButton, Box} from "@mui/material";

export const LinkButton = ({icon, bottom, to}) => {
  return (
    <Box sx={{m: 0, p: 0, right: 20, position: "fixed", zIndex: 1000, bottom}}>
      <Link to={to}>
        <IconButton
          sx={{
            "backgroundColor": "#042dd1",
            "& .MuiSvgIcon-root": {color: "white", fontSize: "1.2em"},
            ":hover": {backgroundColor: "#05239c"},
          }}
        >
          {icon}
        </IconButton>
      </Link>
    </Box>
  );
};
