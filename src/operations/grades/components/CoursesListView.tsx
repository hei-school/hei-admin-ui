/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import {EmptyListComponent} from "@/operations/common/components/EmptyListComponent";
import {ToRaRecord} from "@/providers/types";
import {CourseResult} from "@haapi-b0fc7615/typescript-client";
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
import {StudentLevel, ViewType} from "../types/types";
import {getCourseStatusLabel} from "../utils";
import {StatusChip} from "../utils/StatusChip";
import {GradesDetails} from "./GradesDetails";
import {renderWeightedAverage} from "./utils";

export const CoursesListView: FC<{
  studentId: string;
  studentLevel: StudentLevel;
  viewType: ViewType;
}> = ({studentLevel, studentId, viewType}) => {
  return (
    <ListBase
      queryOptions={{refetchOnWindowFocus: false}}
      filter={{studentId, studentLevel}}
      resource="grades"
    >
      <CoursesListViewContent studentId={studentId} viewType={viewType} />
    </ListBase>
  );
};

const CoursesListViewContent: FC<{
  viewType: ViewType;
  studentId: string;
}> = ({viewType, studentId}) => {
  const {data = [], isLoading} = useListContext();

  if (isLoading) {
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
        {data.length === 0 && (
          <EmptyListComponent
            title="Aucun cours trouvé"
            message="Il n'y a pas de cours ou de notes disponibles pour ce niveau."
          />
        )}
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
  const {data: courseResults = [], isLoading} =
    useListContext<ToRaRecord<CourseResult>>();

  if (isLoading) {
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
        <Card
          elevation={3}
          sx={{borderRadius: 2}}
          data-testid="courses-list-view"
        >
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
                        <Box
                          sx={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <EmptyListComponent
                            title="Aucun cours trouvé"
                            message="Il n'y a pas de cours ou de notes disponibles pour ce niveau."
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    courseResults.map((courseResult, index) => (
                      <TableRow
                        key={
                          courseResult?.id ??
                          `${courseResult?.course?.code ?? "course"}-${index}`
                        }
                        hover
                        data-testid="course-row"
                        sx={{
                          "&:last-child td, &:last-child th": {border: 0},
                          "cursor": "pointer",
                        }}
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
                          {renderWeightedAverage(
                            courseResult?.weighted_average
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <StatusChip
                            label={getCourseStatusLabel(courseResult?.status!)}
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
