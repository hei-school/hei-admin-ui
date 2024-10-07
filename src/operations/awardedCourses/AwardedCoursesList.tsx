import {TextField} from "react-admin";
import {Box} from "@mui/material";
import {HaList} from "@/ui/haList";
import {ButtonBase, HaActionWrapper} from "@/ui/haToolbar";
import {Person as PersonIcon, Add as AddIcon} from "@mui/icons-material";
import {useToggle} from "@/hooks";
import {Dialog} from "@/ui/components";
import {AwardedCoursesCreate} from "./AwardedCourseCreate";

export const AwardedCoursesList = ({courseId}: {courseId: string}) => {
  const [showCreate, _set, toggleShowCreate] = useToggle();

  return (
    <Box>
      <HaList
        icon={<PersonIcon />}
        title="Enseignants"
        resource="awarded-courses"
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
        <AwardedCoursesCreate toggleShowCreate={toggleShowCreate} />
      </Dialog>
    </Box>
  );
};