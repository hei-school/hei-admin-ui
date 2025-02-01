import {HaListTitle} from "@/ui/haList";
import {Grade as GradeIcon, InfoOutlined} from "@mui/icons-material";
import {Box, Button, Divider, Grid, Typography} from "@mui/material";
import * as React from "react";
import {
  Datagrid,
  DateField,
  ListBase,
  ListToolbar,
  NumberField,
  Pagination,
  SelectInput,
  TextField,
  useGetList,
  useListContext,
} from "react-admin";
import {FormProvider, useForm} from "react-hook-form";

export type ExamGradeListProps = {
  resource?: string;
};

const ExamGradeListView: React.FC<{selectedExam: any}> = ({selectedExam}) => {
  const {data, isLoading} = useListContext();

  if (!selectedExam.id) {
    return (
      <Box
        sx={{
          padding: 3,
          backgroundColor: "background.paper",
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
        data-testid="no-exam-selected-message"
      >
        <InfoOutlined sx={{color: "text.secondary"}} />
        <Box>
          <Typography variant="body1" sx={{color: "text.secondary", mb: 1}}>
            Aucun examen sélectionné.
          </Typography>
          <Typography variant="body2" sx={{color: "text.secondary"}}>
            Veuillez choisir un examen dans la liste déroulante ci-dessus et
            cliquer sur "Appliquer" pour afficher les notes des participants.
          </Typography>
        </Box>
      </Box>
    );
  }

  if (isLoading) {
    return <Typography variant="body1">Chargement des données...</Typography>;
  }

  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          padding: 3,
          backgroundColor: "background.paper",
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
        data-testid="no-grade-message"
      >
        <InfoOutlined sx={{color: "text.secondary"}} />
        <Box>
          <Typography variant="body1" sx={{color: "text.secondary", mb: 1}}>
            Aucune note trouvée pour l'examen sélectionné.
          </Typography>
          <Typography variant="body2" sx={{color: "text.secondary"}}>
            Veuillez vérifier que l'examen sélectionné a des notes enregistrées.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <HaListTitle
        title={`Participants avec leur note à l’examen ${selectedExam.name}`}
        icon={<GradeIcon />}
        filterIndicator={true}
        actions={false}
        mainSearch={{label: "", source: ""}}
      />
      <Datagrid data-testid="grade_table">
        <TextField source="student.ref" label="Student Ref" />
        <TextField source="student.first_name" label="First Name" />
        <TextField source="student.last_name" label="Last Name" />
        <NumberField source="grade.score" label="Score" />
        <DateField source="grade.created_at" label="Created At" showTime />
        <DateField source="grade.update_date" label="Updated At" showTime />
        <TextField source="student.groups.0.name" label="Group" />
      </Datagrid>
    </>
  );
};

export const ExamGradeList: React.FC<ExamGradeListProps> = () => {
  const {data: exams = []} = useGetList("exams");
  const formMethods = useForm();
  const [selectedExam, setSelectedExam] = React.useState({id: null, name: ""});

  const handleSubmit = (values: any) => {
    const selectedExam = exams.find((exam) => exam.id === values.exams);
    if (selectedExam) {
      setSelectedExam({id: selectedExam.id, name: selectedExam.title || ""});
    } else {
      console.error("No exam selected or exam not found.");
    }
  };

  const examChoices = React.useMemo(
    () => exams.map(({id, title = ""}) => ({id, name: title})),
    [exams]
  );

  return (
    <ListBase
      resource="exam-grades"
      filter={selectedExam.id ? {examId: selectedExam.id} : undefined}
      perPage={10}
    >
      <Box sx={{padding: 3}}>
        <Typography variant="h6" gutterBottom>
          Choisir un examen
        </Typography>
        <FormProvider {...formMethods}>
          <Box
            component="form"
            onSubmit={formMethods.handleSubmit(handleSubmit)}
          >
            <Grid container spacing={3} alignItems="flex-end">
              <Grid item xs={12} sm={6} md={3}>
                <SelectInput
                  source="exams"
                  label="Examen"
                  choices={examChoices}
                  optionValue="id"
                  optionText="name"
                  fullWidth
                  helperText={false}
                  data-testid="exam-select-button"
                />
              </Grid>
            </Grid>
            <Box mt={3} display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{paddingX: 4}}
                disabled={!formMethods.watch("exams")}
              >
                Appliquer
              </Button>
            </Box>
          </Box>
        </FormProvider>
      </Box>
      <Divider sx={{mt: 3, mb: 2}} />
      <ListToolbar title="Notes" />
      <ExamGradeListView selectedExam={selectedExam} />
      <Pagination />
    </ListBase>
  );
};
