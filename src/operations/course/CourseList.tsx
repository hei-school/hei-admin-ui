import {useToggle} from "@/hooks";
import {CourseListFilter} from "@/operations/course/components";
import {CourseCreate} from "@/operations/course/CourseCreate";
import {CourseEditButton} from "@/operations/course/CourseEditButton";
import {TeacherCourseList} from "@/operations/CourseAssignments/TeacherCourseList";
import {useRole} from "@/security/hooks";
import {Dialog} from "@/ui/components";
import {HaList} from "@/ui/haList";
import {ButtonBase, HaActionWrapper} from "@/ui/haToolbar";
import {Add as AddIcon, Book} from "@mui/icons-material";
import {Box} from "@mui/material";
import {ShowButton, TextField, useNotify} from "react-admin";

export const CourseList = () => {
  const {isTeacher} = useRole();
  return isTeacher() ? <TeacherCourseList /> : <ManagerCourseList />;
};

const ManagerCourseList = () => {
  const [showCreate, , toggleShowCreate] = useToggle();
  const notify = useNotify();

  return (
    <Box>
      <HaList
        icon={<Book />}
        resource="course"
        title="Liste de cours"
        mainSearch={{label: "Code", source: "code"}}
        datagridProps={{
          rowClick: false,
        }}
        actions={
          <Box>
            <HaActionWrapper>
              <ButtonBase
                data-testid="create-button"
                icon={<AddIcon />}
                onClick={toggleShowCreate}
              >
                Créer
              </ButtonBase>
            </HaActionWrapper>
            <CourseListFilter />
          </Box>
        }
      >
        <TextField source="code" label="Code" />
        <TextField source="name" label="Nom" />
        <TextField source="level" label="Niveau" />
        <TextField source="credits" label="Credits" />
        <TextField source="total_hours" label="Heure total" />
        <CourseEditButton />
        <ShowButton data-testid="show-button" />
      </HaList>
      <Dialog
        title="Création d'un cours"
        open={showCreate}
        onClose={toggleShowCreate}
      >
        <CourseCreate
          redirect={false}
          mutationOptions={{
            onSuccess: () => {
              notify("Cours créer avec succès");
              toggleShowCreate();
            },
          }}
        />
      </Dialog>
    </Box>
  );
};
