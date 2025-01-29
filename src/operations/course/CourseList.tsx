import {Add as AddIcon, Book} from "@mui/icons-material";
import {Box} from "@mui/material";
import {ShowButton, TextField, useNotify} from "react-admin";
//TODO: refactor, this CourseLIst facade
import {useToggle} from "@/hooks";
import {TeacherCourseList} from "@/operations/awardedCourses/TeacherCourseList";
import {CourseListFilter} from "@/operations/course/components";
import {CourseCreate} from "@/operations/course/CourseCreate";
import {CourseEditButton} from "@/operations/course/CourseEditButton";
import {useRole} from "@/security/hooks";
import {Dialog} from "@/ui/components";
import {HaList} from "@/ui/haList";
import {ButtonBase, HaActionWrapper} from "@/ui/haToolbar";

export function CourseList() {
  const [showCreate, _set, toggleShowCreate] = useToggle();
  const {isTeacher} = useRole();
  const notify = useNotify();

  if (isTeacher()) {
    return <TeacherCourseList />;
  }

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
}
