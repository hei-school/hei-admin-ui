import {PALETTE_COLORS} from "@/haTheme";
import {FeeStatusEnum} from "@haapi-b0fc7615/typescript-client";
import {
  CheckCircleOutline,
  CreditCardOffOutlined,
  ErrorOutlineOutlined,
  HourglassEmpty,
} from "@mui/icons-material";
import {CSSProperties, ReactNode} from "react";

const ICON_SX = {color: PALETTE_COLORS.white, mr: 1};

const spanStyle = (backgroundColor: string): CSSProperties => ({
  display: "flex",
  alignItems: "center",
  backgroundColor,
  color: PALETTE_COLORS.white,
  padding: "0.5em 1em",
  borderRadius: "25px",
  fontWeight: "bold",
});

interface StatusDisplay {
  text: string;
  icon: ReactNode;
  backgroundColor: string;
}

const statusMap: Record<FeeStatusEnum, StatusDisplay> = {
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

const unexpectedValue: StatusDisplay = {
  text: "?",
  icon: <ErrorOutlineOutlined sx={ICON_SX} />,
  backgroundColor: PALETTE_COLORS.red,
};

export const statusRenderer = (status?: FeeStatusEnum) => {
  const {text, icon, backgroundColor} =
    (status && statusMap[status]) || unexpectedValue;
  return (
    <span style={spanStyle(backgroundColor)}>
      {icon}
      {text}
    </span>
  );
};
