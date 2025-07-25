import {useToggle} from "@/hooks";
import {CourseAssignmentsCreate} from "@/operations/CourseAssignments/CourseAssignmentsCreate";
import {Dialog} from "@/ui/components";
import {HaList} from "@/ui/haList";
import {ButtonBase, HaActionWrapper} from "@/ui/haToolbar";
import {Add as AddIcon, Person as PersonIcon} from "@mui/icons-material";
import {Box} from "@mui/material";
import {TextField} from "react-admin";

export const AssignedTeachersList = ({courseId}: {courseId: string}) => {
  const [showCreate, _set, toggleShowCreate] = useToggle();

  return (
    <Box>
      <HaList
        icon={<PersonIcon />}
        title="Enseignants"
        resource="course-assignments"
        listProps={{
          filterDefaultValues: {courseId: courseId},
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
          </Box>
        }
        datagridProps={{
          rowClick: false,
        }}
      >
        <TextField source="main_teacher.last_name" label="Nom" />
        <TextField source="main_teacher.first_name" label="Prénom" />
        <TextField source="main_teacher.email" label="Email" />
        <TextField source="group.ref" label="Groupe" />
      </HaList>
      <Dialog
        title="Affilier un cours à un enseignant"
        onClose={toggleShowCreate}
        open={showCreate}
      >
        <CourseAssignmentsCreate toggleShowCreate={toggleShowCreate} />
      </Dialog>
    </Box>
  );
};
