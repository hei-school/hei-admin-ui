import {
  alpha,
  Button,
  Paper,
  styled,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

export const GlassCard = styled(Paper)(({theme}) => ({
  "borderRadius": theme.shape.borderRadius * 3,
  "backgroundColor": "#f0f0f0",
  "padding": theme.spacing(3),
  "backdropFilter": "blur(12px)",
  "border": `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  "boxShadow": `0 8px 32px ${alpha(theme.palette.common.black, 0.05)}`,
  "transition": theme.transitions.create(["box-shadow", "transform"], {
    duration: theme.transitions.duration.standard,
  }),
  "&:hover": {
    boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.1)}`,
  },
}));

export const GradientButton = styled(Button)(({theme}) => ({
  "background": `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  "color": theme.palette.common.white,
  "padding": theme.spacing(1.5, 3),
  "borderRadius": theme.shape.borderRadius * 2,
  "textTransform": "none",
  "fontWeight": theme.typography.fontWeightBold,
  "letterSpacing": "0.5px",
  "boxShadow": theme.shadows[3],
  "transition": theme.transitions.create(["transform", "box-shadow"], {
    duration: theme.transitions.duration.standard,
  }),
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[6],
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  },
  "& .MuiButton-startIcon": {
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.standard,
    }),
  },
  "&:hover .MuiButton-startIcon": {
    transform: "translateX(4px)",
  },
}));

export const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({theme}) => ({
  "backgroundColor": alpha(theme.palette.background.paper, 0.8),
  "borderRadius": theme.shape.borderRadius * 2,
  "border": `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  "boxShadow": theme.shadows[1],
  "transition": theme.transitions.create(["box-shadow", "transform"], {
    duration: theme.transitions.duration.shorter,
  }),
  "&:hover": {
    boxShadow: theme.shadows[3],
  },
  "& .MuiToggleButtonGroup-grouped": {
    "margin": theme.spacing(0.5),
    "border": 0,
    "padding": theme.spacing(1, 2),
    "&.Mui-disabled": {
      border: 0,
    },
    "&:not(:first-of-type)": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:first-of-type": {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

export const StyledToggleButton = styled(ToggleButton)(({theme}) => ({
  "transition": theme.transitions.create(["all"], {
    duration: theme.transitions.duration.short,
  }),
  "&.Mui-selected, &.Mui-selected:hover": {
    color: theme.palette.common.white,
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    boxShadow: `0 2px 6px ${alpha(theme.palette.primary.main, 0.3)}`,
    borderRadius: `${theme.shape.borderRadius}px !important`,
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
  },
}));
