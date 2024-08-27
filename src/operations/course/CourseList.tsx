import {useState} from "react";
import {TextField, useNotify} from "react-admin";
import {Box} from "@mui/material";
import {Book, Add as AddIcon} from "@mui/icons-material";
import {HaList} from "@/ui/haList";
import {ButtonBase, HaActionWrapper} from "@/ui/haToolbar";
import {Dialog} from "@/ui/components";
import {CourseCreate} from "@/operations/course/CourseCreate";
import {useToggle} from "@/hooks";
import {CourseShowDialog} from "@/operations/course/CourseShow";
import {CourseListFilter} from "@/operations/course/components";
import {CourseEditButton} from "@/operations/course/CourseEditButton";

export function CourseList() {
  const [showCreate, _set, toggleShowCreate] = useToggle();
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const notify = useNotify();

  return (
    <Box>
      <HaList
        icon={<Book />}
        resource="course"
        title="Liste de cours"
        mainSearch={{label: "Code", source: "code"}}
        datagridProps={{
          rowClick: (id: any) => {
            setSelectedCourseId(id);
          },
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
        <CourseShowDialog courseId={selectedCourseId} />
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
