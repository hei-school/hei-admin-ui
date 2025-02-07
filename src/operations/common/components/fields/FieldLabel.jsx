import {PALETTE_COLORS} from "@/haTheme";
import {Typography} from "@mui/material";

export const FieldLabel = ({children: label, icon}) => (
  <Typography
    color={PALETTE_COLORS.white}
    fontWeight="bold"
    variant="body2"
    sx={{
      "display": "inline-flex",
      "alignItems": "center",
      "fontSize": "1.5em",
      "gap": 1,
      "lineHeight": "1",
      "& .MuiSvgIcon-root": {
        fontSize: "30px",
      },
    }}
  >
    <span
      style={{
        "color": PALETTE_COLORS.yellow,
        "border-radius": "10px",
        "padding": "0.60rem",
        "background-color": "#263B63",
      }}
    >
      {icon}
    </span>
    {label}
  </Typography>
);
