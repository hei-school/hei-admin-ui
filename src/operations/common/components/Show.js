import {Show as RaShow} from "react-admin";
import {Box} from "@mui/material"
import { PALETTE_COLORS } from "../../../ui/constants/palette";

function BackgroundBoxStyle({ sx = {} }) {
  return (
    <Box sx={{
      width: '220px',
      height: '300px',
      position: "absolute",
      bgcolor: PALETTE_COLORS.yellow,
      zIndex: 0,
      ...sx
    }}
    />
  )
}

export const Show = ({children, sx, ...props}) => {
  return (
    <>
      <BackgroundBoxStyle sx={{ bottom: "-70px", position:"fixed", right: "-50px", transform: "rotate(-100deg)" }} />
      <RaShow
        sx={{
          ...sx,
          "& .RaShow-card": {
            backgroundColor: "transparent",
            boxShadow: "none",
            zIndex: 999
          },
        }}
        {...props}
      >
        {children}
      </RaShow>
      <BackgroundBoxStyle sx={{ top: "-70px", left: "-50px", transform: "rotate(-15deg)" }} />
    </>
  );
};
