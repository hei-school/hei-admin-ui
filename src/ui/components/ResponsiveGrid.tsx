import {Box, useMediaQuery} from "@mui/material";
import {FC, ReactNode} from "react";

export interface ResponsiveGridProps {
  children: ReactNode;
  gap?: string | number;
}

export const ResponsiveGrid: FC<ResponsiveGridProps> = ({
  children,
  gap = "1rem",
}) => {
  const isSmall = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(min-width:601px) and (max-width:900px)");
  const isMedium = useMediaQuery("(min-width:901px) and (max-width:1400px)");
  const isDesktop = useMediaQuery("(min-width:1401px) and (max-width:1699px)");
  const isLarge = useMediaQuery("(min-width:1700px)");

  const getGridTemplateColumns = () => {
    if (isSmall) return "1fr";
    if (isTablet) return "1fr 1fr";
    if (isMedium) return "1fr 1fr 1fr";
    if (isDesktop) return "1fr 1fr 1fr 1fr";
    if (isLarge) return "1fr 1fr 1fr 1fr";
    return "1fr";
  };

  return (
    <Box
      sx={{
        display: "grid",
        width: "100%",
        gridTemplateColumns: getGridTemplateColumns(),
        gap: isLarge ? (gap === "1rem" ? "1.1rem" : gap) : gap,
        justifyContent: "flex-start",
        marginTop: "2rem",
        paddingY: "1rem",
        paddingX: "1rem",
      }}
      data-testid="letter-list-wrapper"
    >
      {children}
    </Box>
  );
};
