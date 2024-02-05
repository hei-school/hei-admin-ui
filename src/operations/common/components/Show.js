import {Show as RaShow} from "react-admin";
import {Box, useMediaQuery } from "@mui/material"
import { PALETTE_COLORS } from "../../../ui/constants/palette";

function BackgroundBoxStyle({ sx = {} }) {
  return (
    <Box sx={{
      width: '220px',
      height: '300px',
      position: "fixed",
      bgcolor: PALETTE_COLORS.yellow,
      zIndex: 0,
      ...sx
    }}
    />
  )
}

export const Show = ({children, sx, ...props}) => {
  const isSmall = useMediaQuery("(max-width:1200px)");

  return (
    <>
      {
        !isSmall && 
        <>
          <BackgroundBoxStyle sx={{ bottom: "-70px", right: "-70px", transform: "rotate(-100deg)" }} />
          <BackgroundBoxStyle sx={{ top: "10px", left: "200px", transform: "rotate(-15deg)" }} />
        </>
      }
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
    </>
  );
};
