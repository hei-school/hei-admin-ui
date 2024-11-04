import {useState} from "react";
import {useGetList} from "react-admin";
import {Dayjs} from "dayjs";
import {Box, Button, FormGroup, Typography} from "@mui/material";
import {DateField} from "@mui/x-date-pickers";
import {SelectField} from "@/operations/exams/components/SelectField";

interface FilterValues {
  course?: string;
  teacher?: string;
  group?: string;
  startDate?: Dayjs | null;
  endDate?: Dayjs | null;
}

interface ExamFilterProps {
  onApplyFilters: (filters: FilterValues) => void;
}

export const ExamFilter: React.FC<ExamFilterProps> = ({onApplyFilters}) => {
  const {data: teachers = []} = useGetList("teachers");
  const {data: groups = []} = useGetList("groups");
  const {data: courses = []} = useGetList("course");

  const [selectedCourse, setSelectedCourse] = useState<string | undefined>(
    undefined
  );
  const [selectedTeacher, setSelectedTeacher] = useState<string | undefined>(
    undefined
  );
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>(
    undefined
  );
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const teacherOptions = teachers.map((teacher) => ({
    id: teacher.id,
    name: `${teacher.first_name} ${teacher.last_name}`,
  }));

  const groupOptions = groups.map((group) => ({
    id: group.id,
    name: group.name,
  }));

  const courseOptions = courses.map((course) => ({
    id: course.id,
    name: course.code,
  }));

  const handleApplyFilters = () => {
    const filters = {
      course: selectedCourse,
      teacher: selectedTeacher,
      group: selectedGroup,
      startDate,
      endDate,
    };

    onApplyFilters(filters);
  };

  return (
    <Box
      sx={{
        p: 3,
        mx: "auto",
        borderBottom: "1px solid #ddd",
      }}
    >
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Filtrer les examens
      </Typography>
      <FormGroup
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "space-between",
        }}
      >
        <SelectField
          label="Cours"
          options={courseOptions}
          onChange={(e) => setSelectedCourse(e)}
        />
        <SelectField
          label="Enseignant"
          options={teacherOptions}
          onChange={(e) => setSelectedTeacher(e)}
        />
        <SelectField
          label="Groupe"
          options={groupOptions}
          onChange={(e) => setSelectedGroup(e)}
        />
        <DateField
          label="De"
          fullWidth
          variant="outlined"
          sx={{flex: 1, borderRadius: 2}}
          onChange={(date) => setStartDate(date)}
        />
        <DateField
          label="À"
          fullWidth
          variant="outlined"
          sx={{flex: 1, borderRadius: 2}}
          onChange={(date) => setEndDate(date)}
        />
      </FormGroup>
      <Box sx={{mt: 3, textAlign: "center"}}>
        <Button
          variant="contained"
          color="inherit"
          sx={{
            "backgroundColor": "#000",
            "color": "#fff",
            "px": 5,
            "py": 1.5,
            "fontSize": "11px",
            "borderRadius": 1,
            "width": "100%",
            "&:hover": {backgroundColor: "#333"},
          }}
          onClick={handleApplyFilters}
        >
          Appliquer les filtres
        </Button>
      </Box>
    </Box>
  );
};
