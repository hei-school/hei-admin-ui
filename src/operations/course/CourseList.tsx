import {TextField, useNotify} from "react-admin";
import {Box} from "@mui/material";
import {Book, Add as AddIcon} from "@mui/icons-material";
import {CourseListFilter} from "@/operations/course/components";
import {CourseEditButton} from "@/operations/course/CourseEditButton";
import {CourseCreate} from "@/operations/course/CourseCreate";
import {TeacherCourseList} from "@/operations/awardedCourses/TeacherCourseList";
import {useToggle} from "@/hooks";
import {useRole} from "@/security/hooks";
import {HaList} from "@/ui/haList";
import {ButtonBase, HaActionWrapper} from "@/ui/haToolbar";
import {Dialog} from "@/ui/components";

export function CourseList() {
  const [showCreate, _set, toggleShowCreate] = useToggle();
  const {isTeacher} = useRole();
  const notify = useNotify();

  return isTeacher() ? (
    <TeacherCourseList />
  ) : (
    <Box>
      <HaList
        icon={<Book />}
        resource="course"
        title="Liste de cours"
        mainSearch={{label: "Code", source: "code"}}
        datagridProps={{
          rowClick: (id: any) => `/course/${id}/show`,
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
