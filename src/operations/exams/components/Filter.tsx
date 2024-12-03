import {useMemo} from "react";
import {
  DateTimeInput,
  SelectInput,
  useGetList,
  useListContext,
} from "react-admin";
import {useForm, FormProvider} from "react-hook-form";
import {Box, Button, Grid, Typography} from "@mui/material";

export const FilterExam = () => {
  const {displayedFilters, filterValues, setFilters} = useListContext();

  const {data: courses = []} = useGetList("course");
  const {data: groups = []} = useGetList("groups");

  const form = useForm({
    defaultValues: filterValues,
  });

  const courseChoices = useMemo(() => {
    return courses.map(({id, code = ""}) => ({
      id,
      name: code,
    }));
  }, [courses]);

  const groupChoices = useMemo(() => {
    return groups.map(({id, ref = ""}) => ({
      id,
      name: ref,
    }));
  }, [groups]);

  const onSubmit = (values: any) => {
    setFilters(values, displayedFilters);
  };

  const onResetFilters = () => {
    form.reset();
    setFilters({}, displayedFilters);
  };

  return (
    <FormProvider {...form}>
      <Box component="form" onSubmit={form.handleSubmit(onSubmit)} sx={{p: 3}}>
        <Typography variant="h6" mb={2}>
          Filtres des Examens
        </Typography>
        <Grid container spacing={3} alignItems="flex-end">
          <Grid item xs={12} sm={6} md={3}>
            <SelectInput
              source="group_ref"
              label="Groupe"
              choices={groupChoices}
              optionValue="name"
              optionText="name"
              helperText={false}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <SelectInput
              source="course_code"
              label="Cours"
              choices={courseChoices}
              optionValue="name"
              optionText="name"
              helperText={false}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DateTimeInput
              helperText={false}
              source="examination_date_from"
              label="Date de début"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DateTimeInput
              helperText={false}
              source="examination_date_to"
              label="Date de fin"
              fullWidth
            />
          </Grid>
        </Grid>
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            variant="outlined"
            color="secondary"
            onClick={onResetFilters}
            sx={{mr: 2}}
          >
            Annuler les filtres
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{px: 4}}
          >
            Appliquer les filtres
          </Button>
        </Box>
      </Box>
    </FormProvider>
  );
};
