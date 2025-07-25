import {useToggle} from "@/hooks";
import {CourseAssignmentsCreate} from "@/operations/CourseAssignments/CourseAssignmentsCreate";
import {Dialog} from "@/ui/components";
import {HaList} from "@/ui/haList";
import {ButtonBase, HaActionWrapper} from "@/ui/haToolbar";
import {Group} from "@haapi/typescript-client";
import {Add as AddIcon, Person as PersonIcon} from "@mui/icons-material";
import {Box} from "@mui/material";
import {FunctionField, TextField} from "react-admin";

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
          className: "teacher-assigned-list",
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
        <FunctionField
          label="Groupe"
          render={(record) => {
            return record.groups
              ? record.groups.map((group: Group) => group.ref).join(", ")
              : "Groupe non assigné";
          }}
        />
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
