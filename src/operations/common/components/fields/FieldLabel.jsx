import {Typography} from "@mui/material";
import {PALETTE_COLORS} from "@/haTheme";

export const FieldLabel = ({children: label, icon}) => (
  <Typography
    color={PALETTE_COLORS.typography.black}
    fontWeight="bold"
    variant="body2"
    sx={{
      "display": "inline-flex",
      "alignItems": "center",
      "gap": 1,
      "& .MuiSvgIcon-root": {
        fontSize: "15px",
        mt: "1px",
      },
    }}
  >
    {icon}
    {label}
  </Typography>
);
