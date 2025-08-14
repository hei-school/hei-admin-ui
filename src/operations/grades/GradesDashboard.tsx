import {GlobalSummaryView} from "@/operations/grades/components/GlobalSummaryView";
import {YearlyView} from "@/operations/grades/components/YearlyView";
import {NewViewType} from "@/operations/grades/types/types";
import {
  GlassCard,
  StyledToggleButton,
  StyledToggleButtonGroup,
} from "@/operations/grades/utils/utils";
import {AutoGraph, School} from "@mui/icons-material";
import {Box, Fade, Typography} from "@mui/material";
import {FC, useEffect, useState} from "react";
import {useParams} from "react-router-dom";

export const GradesOverview: FC = () => {
  const [view, setView] = useState<NewViewType>("YEARLY");
  const [mounted, setMounted] = useState(false);
  const {id: studentId} = useParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleViewChange = (
    _: React.MouseEvent<HTMLElement>,
    newView: NewViewType | null
  ) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <GlassCard>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={{xs: "flex-start", sm: "center"}}
        flexDirection={{xs: "column", sm: "row"}}
        gap={3}
        sx={{mb: 3}}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{fontWeight: "bold", color: "primary.main"}}
          >
            Tableau de Bord des Notes
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{display: "flex", alignItems: "center", gap: 1}}
          >
            <School fontSize="small" color="primary" />
            Suivi académique et analyse des performances
          </Typography>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          gap={2}
          flexDirection={{xs: "column", sm: "row"}}
          width={{xs: "100%", sm: "auto"}}
        >
          <StyledToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="view selection"
          >
            <StyledToggleButton value="YEARLY" aria-label="yearly view">
              <Box display="flex" alignItems="center" gap={1}>
                <AutoGraph fontSize="small" />
                Annuelle
              </Box>
            </StyledToggleButton>
            <StyledToggleButton value="GLOBAL" aria-label="global view">
              <Box display="flex" alignItems="center" gap={1}>
                <AutoGraph fontSize="small" />
                Globale
              </Box>
            </StyledToggleButton>
          </StyledToggleButtonGroup>
        </Box>
      </Box>

      {mounted && (
        <Fade in timeout={500}>
          <Box>
            {view === "YEARLY" ? (
              <Box key="yearly-view">
                <YearlyView studentId={studentId!} />
              </Box>
            ) : (
              <Box key="global-view">
                <GlobalSummaryView studentId={studentId!} />
              </Box>
            )}
          </Box>
        </Fade>
      )}
    </GlassCard>
  );
};
