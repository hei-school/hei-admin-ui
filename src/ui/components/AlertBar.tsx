import {Box} from "@mui/material";
import {motion} from "framer-motion";
import {ChevronRight, type LucideIcon} from "lucide-react";
import {useCallback} from "react";
import {useGetList} from "react-admin";
import {useNavigate} from "react-router-dom";

interface AlertBarProps {
  resource: string;
  filter: Record<string, unknown>;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  gradient?: [string, string];
  gradientHover?: [string, string];
  loaderColor?: string;
  navigateTo?: string;
  onClick?: () => void;
  countLabel?: (count: number) => string;
  borderRadius?: string;
}

const DOT_ANIMATION = {scale: [1, 1.5, 1], opacity: [1, 0.5, 1]};
const DOT_TRANSITION_BASE = {
  duration: 1.2,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

const CustomLoader = ({color}: {color: string}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      px: 2,
      mb: -3,
      mt: 2,
    }}
  >
    {[0, 0.2, 0.4].map((delay, i) => (
      <Box
        key={i}
        component={motion.div}
        sx={{width: 8, height: 8, borderRadius: "50%", backgroundColor: color}}
        animate={DOT_ANIMATION}
        transition={{...DOT_TRANSITION_BASE, delay}}
      />
    ))}
  </Box>
);

export const AlertBar = ({
  resource,
  filter,
  title,
  subtitle = "Cliquez pour voir la liste complète",
  icon: Icon,
  gradient = ["#ffb36b", "#eeae5a"],
  gradientHover = ["#ffa652", "#e09c4e"],
  loaderColor = "#140557",
  navigateTo,
  onClick,
  countLabel,
  borderRadius = "8px 8px 0 0",
}: AlertBarProps) => {
  const navigate = useNavigate();

  const {data = [], isLoading, isError} = useGetList(resource, {filter});

  const handleClick = useCallback(() => {
    if (onClick) return onClick();
    if (navigateTo) navigate(navigateTo);
  }, [onClick, navigateTo, navigate]);

  if (isLoading) return <CustomLoader color={loaderColor} />;
  if (isError) return <div>Aucune donnée récupérée</div>;

  const count = data.length;
  if (count === 0) return null;

  const containerSx = {
    "background": `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
    "color": "white",
    "padding": "18px 24px",
    "display": "flex",
    "justifyContent": "space-between",
    "alignItems": "center",
    "cursor": "pointer",
    "transition": "all 0.3s ease",
    "position": "relative",
    "overflow": "hidden",
    borderRadius,
    "&:hover": {
      background: `linear-gradient(135deg, ${gradientHover[0]} 0%, ${gradientHover[1]} 100%)`,
      boxShadow: `0 4px 12px rgba(255, 107, 107, 0.4)`,
      transform: "translateY(-1px)",
    },
    "& .pulse-icon": {animation: "pulse 2s ease-in-out infinite"},
    "@keyframes pulse": {
      "0%, 100%": {opacity: 1},
      "50%": {opacity: 0.5},
    },
  };

  return (
    <Box sx={{px: 2, mb: -3, mt: 2}}>
      <Box
        component={motion.div}
        initial={{opacity: 0, y: -10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.3}}
        onClick={handleClick}
        sx={containerSx}
      >
        <Box sx={{display: "flex", alignItems: "center", gap: "14px"}}>
          <Icon size={24} className="pulse-icon" />
          <Box sx={{display: "flex", flexDirection: "column", gap: "2px"}}>
            <Box component="span" sx={{fontSize: "15px", fontWeight: 600}}>
              {title}
            </Box>
            <Box
              component="span"
              sx={{fontSize: "12px", fontWeight: 400, opacity: 0.9}}
            >
              {subtitle}
            </Box>
          </Box>
        </Box>

        <Box sx={{display: "flex", alignItems: "center", gap: "12px"}}>
          <Box
            sx={{
              background: "rgba(255,255,255,0.25)",
              color: "white",
              padding: "6px 16px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: 700,
              backdropFilter: "blur(10px)",
            }}
          >
            {countLabel ? countLabel(count) : count}
          </Box>
          <ChevronRight size={20} />
        </Box>
      </Box>
    </Box>
  );
};
