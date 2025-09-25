import {CorStatus} from "@haapi-b0fc7615/typescript-client";
import {Chip} from "@mui/material";
import {styled} from "@mui/material/styles";

type StatusChipProps = {
  status?: CorStatus;
  labelOverride?: string;
  size?: "small" | "medium";
};

const STATUS_MAP: Record<
  string,
  {
    label: string;
    from: string;
    to: string;
    shadow: string;
    accent: string;
  }
> = {
  [CorStatus.IN_PROGRESS]: {
    label: "En cours",
    from: "#667eea",
    to: "#764ba2",
    shadow: "#667eea",
    accent: "#4f46e5",
  },
  [CorStatus.STAY]: {
    label: "Resté",
    from: "#11998e",
    to: "#38ef7d",
    shadow: "#11998e",
    accent: "#059669",
  },
  [CorStatus.LEAVE]: {
    label: "Quitté",
    from: "#fc466b",
    to: "#3f5efb",
    shadow: "#fc466b",
    accent: "#dc2626",
  },
  [CorStatus.CANCELED]: {
    label: "Annulé",
    from: "#FDBB2D",
    to: "#22C1C3",
    shadow: "#FDBB2D",
    accent: "#f59e0b",
  },
  [CorStatus.NO_SHOW]: {
    label: "non-présenté",
    from: "#bdc3c7",
    to: "#2c3e50",
    shadow: "#95a5a6",
    accent: "#6b7280",
  },
};

const Chips = styled(Chip)<{statusConfig: any; chipSize: string}>(
  ({statusConfig, chipSize}) => ({
    "height": chipSize === "small" ? 32 : 36,
    "borderRadius": 20,
    "background": `linear-gradient(135deg, ${statusConfig.from}15, ${statusConfig.to}08)`,
    "backdropFilter": "blur(12px) saturate(180%)",
    "border": `1px solid ${statusConfig.from}25`,
    "color": statusConfig.accent,
    "fontWeight": 600,
    "fontSize": chipSize === "small" ? "0.78rem" : "0.85rem",
    "letterSpacing": "0.02em",
    "position": "relative",
    "overflow": "hidden",
    "cursor": "pointer",

    "& .MuiChip-label": {
      padding: chipSize === "small" ? "0 16px" : "0 20px",
      position: "relative",
      zIndex: 3,
      textShadow: `0 1px 2px ${statusConfig.shadow}15`,
    },

    "&::before": {
      content: '""',
      position: "absolute",
      inset: -2,
      padding: 2,
      background: `conic-gradient(from 0deg, ${statusConfig.from}, ${statusConfig.to}, ${statusConfig.from})`,
      borderRadius: 22,
      mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
      maskComposite: "xor",
      WebkitMask:
        "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
      WebkitMaskComposite: "xor",
      animation: "rotate 3s linear infinite",
      opacity: 0,
      transition: "opacity 0.3s ease",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      inset: 0,
      borderRadius: 20,
      background: `radial-gradient(circle at 50% 0%, ${statusConfig.from}20, transparent 70%)`,
      opacity: 0,
      transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    "@keyframes float": {
      "0%, 100%": {transform: "translateY(0px)"},
      "50%": {transform: "translateY(-1px)"},
    },

    "@keyframes rotate": {
      "0%": {transform: "rotate(0deg)"},
      "100%": {transform: "rotate(360deg)"},
    },

    "@keyframes pulse": {
      "0%, 100%": {
        boxShadow: `0 0 0 0 ${statusConfig.shadow}40`,
      },
      "50%": {
        boxShadow: `0 0 0 8px ${statusConfig.shadow}00`,
      },
    },
    "boxShadow": `
      0 4px 14px ${statusConfig.shadow}12,
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,

    "transition": "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",

    "&:hover": {
      "transform": "translateY(-2px) scale(1.02)",
      "background": `linear-gradient(135deg, ${statusConfig.from}25, ${statusConfig.to}15)`,
      "boxShadow": `
        0 12px 32px ${statusConfig.shadow}25,
        0 2px 8px ${statusConfig.shadow}20,
        inset 0 1px 0 rgba(255, 255, 255, 0.2)
      `,
      "animation": "float 2s ease-in-out infinite",

      "&::before": {
        opacity: 1,
      },

      "&::after": {
        opacity: 1,
      },
    },

    "&:active": {
      animation: "pulse 0.6s ease-out",
      transform: "translateY(-1px) scale(1.01)",
    },

    "@keyframes chipEntrance": {
      "0%": {
        opacity: 0,
        transform: "scale(0.8) rotateX(90deg)",
        filter: "blur(4px)",
      },
      "50%": {
        opacity: 0.8,
        transform: "scale(1.05) rotateX(45deg)",
      },
      "100%": {
        opacity: 1,
        transform: "scale(1) rotateX(0deg)",
        filter: "blur(0px)",
      },
    },
    "animation": "chipEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",

    "@media (max-width: 600px)": {
      height: chipSize === "small" ? 30 : 34,
      fontSize: chipSize === "small" ? "0.75rem" : "0.8rem",
    },
  })
);

export default function StatusChip({
  status,
  labelOverride,
  size = "small",
}: StatusChipProps) {
  const statusConfig = (status && STATUS_MAP[status]) || {
    label: labelOverride ?? status ?? "—",
    from: "#e5e7eb",
    to: "#9ca3af",
    shadow: "#9ca3af",
    accent: "#6b7280",
  };

  const label = labelOverride ?? statusConfig.label;

  return (
    <Chips
      label={label}
      size={size}
      statusConfig={statusConfig}
      chipSize={size}
    />
  );
}
