import {TextField, useNotify} from "react-admin";
import {Book, Add as AddIcon} from "@mui/icons-material";
import {HaList} from "@/ui/haList";
import {CourseListFilter} from "./components";
import {CourseEditButton} from "./CourseEditButton";
import {ButtonBase, HaActionWrapper} from "@/ui/haToolbar";
import {Dialog} from "@/ui/components";
import {CourseCreate} from "./CourseCreate";
import {useToggle} from "@/hooks";
import {CourseShowDialog} from "./CourseShow";
import {useState} from "react";

export function CourseList() {
  const [showCreate, _set, toggleShowCreate] = useToggle();
  const [showDetails, toggleShowDetails] = useToggle();
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const notify = useNotify();

  return (
    <>
      <HaList
        icon={<Book />}
        resource="course"
        title="Liste de cours"
        mainSearch={{label: "Code", source: "code"}}
        datagridProps={{
          rowClick: (id: any) => {
            setSelectedCourseId(id);
            toggleShowDetails(true);
          },
        }}
        actions={
          <>
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
          </>
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

      <CourseShowDialog
        open={showDetails}
        onClose={toggleShowDetails}
        courseId={selectedCourseId}
      />
    </>
  );
}
