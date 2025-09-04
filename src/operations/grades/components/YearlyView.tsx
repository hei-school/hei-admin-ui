import {useNotify} from "@/hooks";
import {CoursesListView} from "@/operations/grades/components/CoursesListView";
import {TranscriptOverview} from "@/operations/grades/components/TranscriptOverview";
import {StudentLevel, ViewType} from "@/operations/grades/types/types";
import {levelChoices} from "@/operations/grades/utils";
import {getGradeColor} from "@/operations/grades/utils/getGradeColor";
import dataProvider from "@/providers/dataProvider";
import {ToRaRecord} from "@/providers/types";
import {YearlyResult} from "@haapi-b0fc7615/typescript-client";
import {Apps, Download, List, School} from "@mui/icons-material";
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
import {GradientButton} from "../utils/utils";

export const YearlyView: FC<{studentId: string}> = ({studentId}) => {
  const [selectedLevel, setSelectedLevel] = useState<StudentLevel>(
    StudentLevel.L1
  );
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState<ViewType>("LIST");
  const notify = useNotify();

  const handleViewType = (
    _: React.MouseEvent<HTMLElement>,
    newViewType: ViewType | null
  ) => {
    if (newViewType !== null) {
      setViewType(newViewType);
    }
  };

  const downloadFile = async (url: string, filename: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(downloadUrl);
  };

  const {
    data: result,
    isLoading,
    error,
  } = useGetOne<ToRaRecord<YearlyResult>>(
    "grades",
    {
      id: studentId || "",
      meta: {
        studentLevel: selectedLevel,
      },
    },
    {refetchOnWindowFocus: false}
  );

  const handleDownload = async () => {
    setLoading(true);

    try {
      const res = await dataProvider.getOne("grades-details", {
        id: studentId || "",
        meta: {studentLevel: selectedLevel},
      });

      const status = res.data?.status;
      const link = res.data?.link;

      if (status === "AVAILABLE" && link) {
        await downloadFile(link, `Relevé des notes ${selectedLevel}.pdf`);
      } else {
        notify("Le fichier n'est pas disponible", {type: "warning"});
      }
    } catch (error) {
      console.error("Download error:", error);
      notify("Erreur lors du téléchargement", {type: "error"});
    } finally {
      setLoading(false);
    }
  };

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
          flexDirection={{xs: "column", sm: "row"}}
          justifyContent="space-between"
          alignItems={{xs: "stretch", sm: "center"}}
          mt={3}
          pt={2}
          borderTop={1}
          borderColor="divider"
          gap={2}
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
              mb: {xs: 2, sm: 0},
              width: {xs: "100%", sm: "auto"},
            }}
          />
          <Box
            display="flex"
            flexDirection={{xs: "column", sm: "row"}}
            gap={2}
            alignItems={{xs: "stretch", sm: "center"}}
            sx={{
              bgcolor: "grey.50",
              p: 1,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "grey.200",
              width: {xs: "100%", sm: "auto"},
            }}
          >
            <FormControl
              variant="outlined"
              size="small"
              sx={{minWidth: 120, width: {xs: "100%", sm: "auto"}}}
            >
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
                sx={{borderRadius: 2, width: {xs: "100%", sm: "auto"}}}
              >
                {levelChoices.map((choice) => (
                  <MenuItem key={choice.id} value={choice.id}>
                    {choice.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box
              display="flex"
              justifyContent={{xs: "stretch", sm: "right"}}
              alignItems="flex-end"
              mb={{xs: 0, sm: 2}}
              mt={{xs: 1, sm: 0}}
              width={{xs: "100%", sm: "auto"}}
            >
              <GradientButton
                className="download-button"
                variant="contained"
                size="large"
                startIcon={<Download />}
                onClick={handleDownload}
                disabled={loading}
                sx={{
                  width: {xs: "100%", sm: "auto"},
                  color: "whitesmoke !important",
                }}
              >
                {loading ? "Patientez..." : `Relevé ${selectedLevel}`}
              </GradientButton>
            </Box>
            <ToggleButtonGroup
              size="small"
              value={viewType}
              exclusive
              onChange={handleViewType}
              aria-label="view type"
              sx={{
                "width": {xs: "100%", sm: "auto"},
                ".MuiToggleButton-root": {
                  flex: 1,
                },
              }}
            >
              <ToggleButton
                value="GRID"
                aria-label="grid view"
                data-testid="grid-view-toggle"
                sx={{width: {xs: "50%", sm: "auto"}}}
              >
                <Apps />
              </ToggleButton>
              <ToggleButton
                value="LIST"
                aria-label="list view"
                data-testid="list-view-toggle"
                sx={{width: {xs: "50%", sm: "auto"}}}
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
