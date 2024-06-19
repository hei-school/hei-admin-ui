import {useState} from "react";
import {
  Datagrid,
  EditButton,
  FunctionField,
  List,
  ShowButton,
  TextField,
  CreateButton,
  useListContext,
  useGetOne,
  useGetList,
} from "react-admin";
import {
  Box,
  Avatar as MuiAvatar,
  AvatarGroup as MuiAvatarGroup,
} from "@mui/material";
import {
  Group as GroupIcon,
  Diversity2 as StudentIcon,
  Female as FemaleIcon,
  Male as MaleIcon,
} from "@mui/icons-material";
import {Sex} from "@haapi/typescript-client";
import {HaList} from "@/ui/haList";
import {COMMON_BUTTON_PROPS} from "@/ui/constants/common_styles";
import {PALETTE_COLORS} from "@/haTheme";
import {DateField} from "../common/components/fields";
import {GroupFilters} from "./components/GroupFilters";
import {ListHeader} from "../common/components";
import defaultProfilePicture from "@/assets/blank-profile-photo.png";
import {NOOP_ID} from "@/utils/constants";

const Avatar = ({student = {ref: "", profile_picture: ""}}) => {
  const [isLoaded, setLoaded] = useState(false);

  return (
    <MuiAvatar
      alt={student.ref}
      src={isLoaded ? student.profile_picture : defaultProfilePicture}
      onLoad={() => setLoaded(true)}
    />
  );
};

const AvatarGroup = ({groupId = ""}) => {
  const {data: students = []} = useGetList("group-students", {meta: {groupId}});

  return (
    <MuiAvatarGroup max={4}>
      {students.map((student) => (
        <Avatar key={student.ref} student={student} />
      ))}
    </MuiAvatarGroup>
  );
};

const GroupList = () => {
  const {
    data: stats = {
      total_groups: 0,
      total_students: 0,
      women: 0,
      men: 0,
      students_alternating: 0,
    },
  } = useGetOne("stats", {id: NOOP_ID});

  const headerCardContent = [
    {
      title: "Groupes",
      icon: <GroupIcon fontSize="medium" />,
      total: stats.total_groups,
    },
    {
      title: "Étudiants",
      icon: <StudentIcon fontSize="medium" />,
      total: stats.total_students,
    },
    {
      title: "Femmes",
      icon: <FemaleIcon fontSize="medium" />,
      total: stats.women,
    },
    {
      title: "Hommes",
      icon: <MaleIcon fontSize="medium" />,
      total: stats.men,
    },
  ];

  return (
    <Box>
      <ListHeader
        title="Liste des groupes"
        cardContents={headerCardContent}
        action={
          <CreateButton
            {...COMMON_BUTTON_PROPS}
            size="medium"
            SX={{
              m: "0px",
            }}
          />
        }
      />
      <HaList
        listProps={{title: "Groupes"}}
        resource="groups"
        title="Liste des groupes"
        icon={<GroupIcon />}
        actions={<GroupFilters />}
      >
        <FunctionField
          source="ref"
          label="Référence"
          render={(group = {ref: ""}) => (
            <MuiAvatar
              sx={{
                width: "3rem",
                height: "3rem",
                bgcolor: PALETTE_COLORS.primary,
                color: PALETTE_COLORS.yellow,
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              {group.ref.slice(0, 3)}
            </MuiAvatar>
          )}
        />
        <TextField source="name" label="Nom" />
        <DateField
          source="creation_datetime"
          label="Date de création"
          showTime={false}
        />
        <FunctionField
          label="Étudiants"
          render={(group) => <AvatarGroup groupId={group?.id} />}
        />
        <Box display="flex" justifyContent="space-evenly">
          <ShowButton />
          <EditButton sx={{color: PALETTE_COLORS.yellow}} />
        </Box>
      </HaList>
    </Box>
  );
};

export default GroupList;
