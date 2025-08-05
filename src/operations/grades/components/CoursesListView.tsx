import {ToRaRecord} from "@/providers/types";
import {CourseResult, StudentLevel} from "@haapi/typescript-client";
import {Search} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {FC} from "react";
import {ListBase, useListContext} from "react-admin";
import {v4} from "uuid";
import {ViewType} from "../GradesDashboard";
import {StatusChip} from "../utils/StatusChip";
import {GradesDetails} from "./GradesDetails";

export const CoursesListView: FC<{
  studentId: string;
  studentLevel: StudentLevel;
  viewType: ViewType;
}> = ({studentLevel, studentId, viewType}) => {
  return (
    <ListBase filter={{studentId, studentLevel}} resource="grades">
      <CoursesListViewContent studentId={studentId} viewType={viewType} />
    </ListBase>
  );
};

const CoursesListViewContent: FC<{
  viewType: ViewType;
  studentId: string;
}> = ({viewType, studentId}) => {
  const {data = [], isFetching} = useListContext();

  if (isFetching) {
    return (
      <Card elevation={0} sx={{mb: 3, borderRadius: 4, p: 3}}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={200}
        >
          <CircularProgress />
        </Box>
      </Card>
    );
  }

  if (viewType === "GRID") {
    return (
      <>
        {data.map((details) => (
          <GradesDetails
            key={v4()}
            studentId={studentId}
            courseResult={details}
          />
        ))}
      </>
    );
  }

  return <CoursesListViewList />;
};

const CoursesListViewList = () => {
  const {data: courseResults = [], isFetching} =
    useListContext<ToRaRecord<CourseResult>>();

  if (isFetching) {
    return (
      <Card elevation={0} sx={{mb: 3, borderRadius: 4, p: 3}}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={200}
        >
          <CircularProgress />
        </Box>
      </Card>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card elevation={3} sx={{borderRadius: 2}}>
          <CardContent>
            <Typography variant="h6" sx={{fontWeight: "bold", mb: 2}}>
              Mes Cours et Notes
            </Typography>
            <Divider sx={{mb: 3}} />
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Matière</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Code</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Crédits</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Moyenne</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Statut</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courseResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{py: 4}}>
                        <Box textAlign="center">
                          <Search
                            sx={{
                              fontSize: 48,
                              color: "text.secondary",
                              mb: 1,
                            }}
                          />
                          <Typography variant="h6" color="textSecondary">
                            Aucun cours trouvé
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Essayez de modifier vos critères de recherche
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    courseResults.map((courseResult) => (
                      <TableRow
                        key={courseResult?.id}
                        hover
                        sx={{
                          "&:last-child td, &:last-child th": {border: 0},
                          "cursor": "pointer",
                        }}
                        onClick={() => {}}
                      >
                        <TableCell component="th" scope="row">
                          <Typography fontWeight="medium">
                            {courseResult?.course?.name}
                          </Typography>
                        </TableCell>
                        <TableCell>{courseResult?.course?.code}</TableCell>
                        <TableCell align="right">
                          {courseResult?.course?.credits}
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            fontWeight="bold"
                            color={
                              (courseResult?.weighted_average ?? 0 >= 10)
                                ? "success.main"
                                : "error.main"
                            }
                          >
                            {courseResult?.weighted_average?.toFixed(2)}/20
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <StatusChip
                            label={courseResult?.status?.toUpperCase()}
                            size="small"
                            status={courseResult?.status!}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
