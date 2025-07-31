import {HaList} from "@/ui/haList";
import {Chip, Grid, Typography} from "@mui/material";

import {CourseResult, StudentLevel} from "@haapi/typescript-client";
import {BookOpenText} from "lucide-react";
import {FC} from "react";
import {FunctionField, TextField} from "react-admin";
import {StatusChip} from "../utils/StatusChip";
import {getCourseStatusLabel} from "../utils/constants";
import {getGradeColor} from "../utils/getGradeColor";

export const CoursesListView: FC<{
  studentId: string;
  studentLevel: StudentLevel;
}> = ({studentLevel, studentId}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <HaList
          listProps={{
            filter: {studentId, studentLevel},
            pagination: false,
          }}
          filterIndicator={false}
          resource="grades"
          datagridProps={{
            rowClick: false,
          }}
          title="Mes Cours et Notes"
          icon={<BookOpenText />}
          actions={null}
        >
          <TextField source="course.name" label="Matière" />
          <TextField source="course.code" label="Code" />
          <TextField source="course.credits" label="Crédits" />
          <FunctionField
            source="weighted_average"
            label="Moyenne"
            render={(record: CourseResult) => {
              return (
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: "center",
                    color: () => getGradeColor(record.weighted_average!),
                    fontWeight: "bold",
                  }}
                >
                  {record.weighted_average?.toFixed(2) || "non défini"}/20
                </Typography>
              );
            }}
          />
          <FunctionField
            label="Statut"
            render={(record: CourseResult) => (
              <StatusChip
                label={getCourseStatusLabel(record.status)}
                size="small"
                status={record.status!}
              />
            )}
          />
          <Chip
            label="Voir détails"
            size="small"
            color="primary"
            variant="outlined"
          />
        </HaList>
      </Grid>
    </Grid>
  );
};
