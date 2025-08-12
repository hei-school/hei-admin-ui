import {CoursesListView} from "@/operations/grades/components/CoursesListView";
import {TranscriptOverview} from "@/operations/grades/components/TranscriptOverview";
import {StudentLevel, ViewType} from "@/operations/grades/types/types";
import {levelChoices} from "@/operations/grades/utils";
import {getGradeColor} from "@/operations/grades/utils/getGradeColor";
import {Apps, List, School} from "@mui/icons-material";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {FC, useState} from "react";
import {useGetOne} from "react-admin";
import {useParams} from "react-router-dom";

export const YearlyView: FC = () => {
  const {id: studentId} = useParams();

  const [selectedLevel, setSelectedLevel] = useState<StudentLevel>(
    StudentLevel.L1
  );
  const [viewType, setViewType] = useState<ViewType>("GRID");

  const handleViewType = (
    _: React.MouseEvent<HTMLElement>,
    newViewType: ViewType | null
  ) => {
    if (newViewType !== null) {
      setViewType(newViewType);
    }
  };

  const {
    data: result,
    isLoading,
    error,
  } = useGetOne(
    "grades",
    {
      id: studentId || "",
      meta: {
        studentLevel: selectedLevel,
      },
    },
    {refetchOnWindowFocus: false}
  );

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 4,
          border: "1px solid",
          borderColor: "grey.300",
          bgcolor: "grey.50",
        }}
      >
        <TranscriptOverview
          error={error}
          isLoading={isLoading}
          result={result}
        />

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mt={3}
          pt={2}
          borderTop={1}
          borderColor="divider"
        >
          <Chip
            icon={<School color="inherit" />}
            label={`Crédits validés: ${result?.obtained_credits ?? 0} / ${result?.total_credits ?? 0}`}
            variant="outlined"
            sx={{
              fontWeight: "bold",
              color: getGradeColor(
                result?.total_credits
                  ? ((result.obtained_credits ?? 0) / result.total_credits) * 20
                  : 0
              ),
              borderColor: getGradeColor(
                result?.total_credits
                  ? ((result.obtained_credits ?? 0) / result.total_credits) * 20
                  : 0
              ),
            }}
          />
          <Box
            display="flex"
            gap={2}
            alignItems="center"
            sx={{
              bgcolor: "grey.50",
              p: 1,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <FormControl variant="outlined" size="small" sx={{minWidth: 120}}>
              <InputLabel id="level-select-label">
                Filtrer par niveau
              </InputLabel>
              <Select
                labelId="level-select-label"
                data-testid="level-select"
                value={selectedLevel}
                onChange={(e) =>
                  setSelectedLevel(e.target.value as StudentLevel)
                }
                label="Filtrer par niveau"
                sx={{borderRadius: 2}}
              >
                {levelChoices.map((choice) => (
                  <MenuItem key={choice.id} value={choice.id}>
                    {choice.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <ToggleButtonGroup
              size="small"
              value={viewType}
              exclusive
              onChange={handleViewType}
              aria-label="view type"
            >
              <ToggleButton value="GRID" aria-label="grid view">
                <Apps />
              </ToggleButton>
              <ToggleButton
                value="LIST"
                aria-label="list view"
                data-testid="list-view-toggle"
              >
                <List />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      </Paper>

      <CoursesListView
        studentLevel={selectedLevel}
        studentId={studentId!}
        viewType={viewType}
      />
    </Box>
  );
};
