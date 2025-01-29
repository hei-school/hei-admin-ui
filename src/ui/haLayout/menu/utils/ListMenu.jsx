import {PALETTE_COLORS} from "@/haTheme";
import {ArrowDropDown, ArrowDropUp} from "@mui/icons-material";
import {Box, Collapse} from "@mui/material";
import {useState} from "react";
import {SingleMenuBase} from "./SingleMenu";

export function ListMenu({children, label, icon, ...rest}) {
  const [showList, setShowList] = useState(false);

  return (
    <Box
      sx={{width: "100%", color: PALETTE_COLORS.white}}
      component="div"
      {...rest}
    >
      <Box
        sx={{
          "cursor": "pointer",
          "display": "flex",
          "alignItems": "center",
          "justifyContent": "space-between",
          "pr": 2,
          "mb": 2,
          "width": "100%",
          ":hover": {color: PALETTE_COLORS.yellow},
        }}
        component="div"
        onClick={() => setShowList(!showList)}
      >
        <SingleMenuBase label={label} icon={icon} sx={{mb: 0}} />
        {showList ? <ArrowDropUp /> : <ArrowDropDown />}
      </Box>
      <Collapse in={showList} unmountOnExit sx={{color: PALETTE_COLORS.white}}>
        {children}
      </Collapse>
    </Box>
  );
}
