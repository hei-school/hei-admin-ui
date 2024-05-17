import {useState} from "react";
import {
  Datagrid,
  EditButton,
  FunctionField,
  List,
  ShowButton,
  TextField,
  useGetList,
} from "react-admin";
import {
  Box,
  Avatar as MuiAvatar,
  AvatarGroup as MuiAvatarGroup,
} from "@mui/material";
import {GroupsOutlined} from "@mui/icons-material";
import {HaList} from "@/ui/haList";
import {DateField} from "../common/components/fields";
import {GroupFilters} from "./components/GroupFilters";
import {PALETTE_COLORS} from "@/haTheme";
import defaultProfilePicture from "@/assets/blank-profile-photo.png";
import {ListHeader} from "../common/components";

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
        <Avatar student={student} />
      ))}
    </MuiAvatarGroup>
  );
};
const GroupList = () => {
  return (
    <Box>
      <ListHeader title="Liste des groupes" />
      <HaList
        listProps={{title: "Groupes"}}
        resource="groups"
        title="Liste des groupes"
        icon={<GroupsOutlined />}
        actions={<GroupFilters />}
        mainSearch={{source: "ref", label: "Référence"}}
      >
        <FunctionField
          source="ref"
          label="Référence"
          render={(group = {ref: ""}) => (
            <MuiAvatar
              sx={{
                width: "50px",
                height: "50px",
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
