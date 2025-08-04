import {StudentLevel} from "@haapi/typescript-client";
import {
  Apps as AppsIcon,
  Download,
  List as ListIcon,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import {FC, useState} from "react";
import {Button, useGetOne} from "react-admin";
import {useParams} from "react-router-dom";
import {CoursesListView} from "./components/CoursesListView";
import {TranscriptOverview} from "./components/TranscriptOverview";
import {levelChoices} from "./utils";
import {getGradeColor} from "./utils/getGradeColor";

export type ViewType = "GRID" | "LIST";

export const GradesOverview: FC = () => {
  const {id: studentId} = useParams();

  const [selectedLevel, setSelectedLevel] = useState<StudentLevel>(
    StudentLevel.L1
  );
  const [viewType, setViewType] = useState<ViewType>("GRID");
  const toggleViewType = () =>
    setViewType((prev) => (prev === "GRID" ? "LIST" : "GRID"));

  const {
    data: result,
    isLoading,
    error,
  } = useGetOne("grades", {
    id: studentId || "",
    meta: {
      studentLevel: selectedLevel,
    },
  });

  return (
    <Box sx={{p: 3}}>
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography
            variant="h4"
            sx={{fontWeight: "bold", color: "primary.main", fontSize: "2rem"}}
          >
            Tableau de Bord des Notes
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="medium"
            sx={{
              padding: "0.5rem 1rem",
            }}
            startIcon={<Download />}
            onClick={() => null}
            label="Télécharger le relevé"
          />
        </Box>

        <TranscriptOverview
          error={error}
          isLoading={isLoading}
          result={result}
        />

        <Box
          display="flex"
          gap={2}
          alignItems="center"
          justifyContent="right"
          paddingInline={2}
          mb={3}
          flexWrap="wrap"
        >
          <Box flex={2}></Box>
          <IconButton onClick={toggleViewType}>
            {viewType === "GRID" ? <ListIcon /> : <AppsIcon />}
          </IconButton>
          <FormControl variant="outlined" size="small" sx={{minWidth: 200}}>
            <InputLabel id="level-select-label">Filtrer par niveau</InputLabel>
            <Select
              labelId="level-select-label"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as StudentLevel)}
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
          <Box display="flex" gap={1} ml="auto">
            <Chip
              label={`${result?.obtained_credits ? result?.obtained_credits : 0} / ${result?.total_credits ? result?.total_credits : 0} crédits`}
              variant="outlined"
              sx={{
                fontWeight: "bold",
                color: getGradeColor(
                  result?.total_credits
                    ? ((result.obtained_credits ?? 0) / result.total_credits) *
                        20
                    : 0
                ),
                borderColor: getGradeColor(
                  result?.total_credits
                    ? ((result.obtained_credits ?? 0) / result.total_credits) *
                        20
                    : 0
                ),
              }}
            />
          </Box>
        </Box>
      </Box>
      <CoursesListView
        studentLevel={selectedLevel}
        studentId={studentId!}
        viewType={viewType}
      />
    </Box>
  );
};
