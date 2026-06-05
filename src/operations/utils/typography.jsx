import {PALETTE_COLORS} from "@/haTheme";
import {
  CheckCircleOutline,
  CreditCardOffOutlined,
  ErrorOutlineOutlined,
  HourglassEmpty,
} from "@mui/icons-material";

const ICON_SX = {color: PALETTE_COLORS.white, mr: 1};

const spanStyle = (backgroundColor) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor,
  color: PALETTE_COLORS.white,
  padding: "0.5em 1em",
  borderRadius: "25px",
  fontWeight: "bold",
});

const statusMap = {
  LATE: {
    text: "En retard",
    icon: <ErrorOutlineOutlined sx={ICON_SX} />,
    backgroundColor: PALETTE_COLORS.red,
  },
  PAID: {
    text: "Payé",
    icon: <CheckCircleOutline sx={ICON_SX} />,
    backgroundColor: "#388E3C",
  },
  UNPAID: {
    text: "Non payé",
    icon: <CreditCardOffOutlined sx={ICON_SX} />,
    backgroundColor: "#fbbf24",
  },
  PENDING: {
    text: "En cours de vérification",
    icon: <HourglassEmpty sx={ICON_SX} />,
    backgroundColor: PALETTE_COLORS.primary,
  },
};

const unexpectedValue = {
  text: "?",
  icon: <ErrorOutlineOutlined sx={ICON_SX} />,
  backgroundColor: PALETTE_COLORS.red,
};

export const statusRenderer = (status) => {
  const {text, icon, backgroundColor} = statusMap[status] || unexpectedValue;
  return (
    <span style={spanStyle(backgroundColor)}>
      {icon}
      {text}
    </span>
  );
};
