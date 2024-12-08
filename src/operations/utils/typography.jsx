import {
  CheckCircleOutline,
  HourglassEmpty,
  CancelOutlined,
  ErrorOutlineOutlined,
} from "@mui/icons-material";
import {PALETTE_COLORS} from "@/haTheme";

const statusMap = {
  LATE: {
    text: "En retard",
    icon: <ErrorOutlineOutlined sx={{color: PALETTE_COLORS.white, mr: 1}} />,
    backgroundColor: PALETTE_COLORS.red,
  },
  PAID: {
    text: "Payé",
    icon: <CheckCircleOutline sx={{color: PALETTE_COLORS.white, mr: 1}} />,
    backgroundColor: "#388E3C",
  },
  UNPAID: {
    text: "En cours",
    icon: <HourglassEmpty sx={{color: PALETTE_COLORS.white, mr: 1}} />,
    backgroundColor: "#fbbf24",
  },
};

const unexpectedValue = {
  text: "?",
  icon: <ErrorOutlineOutlined sx={{color: PALETTE_COLORS.white, mr: 1}} />,
  backgroundColor: PALETTE_COLORS.red,
};

export const statusRenderer = (status) => {
  const {text, icon, backgroundColor} = statusMap[status] || unexpectedValue;
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: backgroundColor,
        color: PALETTE_COLORS.white,
        padding: "0.5em 1em",
        borderRadius: "25px",
        fontWeight: "bold",
      }}
    >
      {icon}
      {text}
    </span>
  );
};
