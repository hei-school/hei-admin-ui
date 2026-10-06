import defaultProfilePicture from "@/assets/blank-profile-photo.png";
import {PALETTE_COLORS} from "@/haTheme";
import {useRole} from "@/security/hooks";
import {COMMON_BUTTON_PROPS} from "@/ui/constants/common_styles";
import {HaList} from "@/ui/haList";
import {CreateButton, ExportButton} from "@/ui/haToolbar";
import {NOOP_ID} from "@/utils/constants";
import {Group, Statistics, Student} from "@haapi-b0fc7615/typescript-client";
import {Group as GroupIcon} from "@mui/icons-material";
import {
  Box,
  Avatar as MuiAvatar,
  AvatarGroup as MuiAvatarGroup,
} from "@mui/material";
import {useState} from "react";
import {
  EditButton,
  FunctionField,
  CreateButton as RaCreateButton,
  ShowButton,
  TextField,
  useGetList,
  useGetOne,
} from "react-admin";
import {ListHeader} from "../common/components";
import {DateField} from "../common/components/fields";
import {
  CommonListHeaderStats,
  getCommonListHeaderContent,
} from "../common/utils/commonListHeaderContent";
import {ToRaRecord} from "../common/utils/types";
import {GroupFilters} from "./components/GroupFilters";

// a group always has a reference
type GroupRecord = ToRaRecord<Group> & Required<Pick<Group, "ref">>;

// the "users" statistics read by this page
type UsersStats = ToRaRecord<Statistics> &
  CommonListHeaderStats &
  Required<Pick<Statistics, "total_groups">>;

// shown while the statistics are loading: the student cards then show 0
const LOADING_STATS: CommonListHeaderStats & {total_groups: string} = {
  total_groups: "...",
  women: {},
  men: {},
};

interface AvatarProps {
  student?: Pick<Student, "ref" | "profile_picture">;
}

interface AvatarGroupProps {
  group?: Pick<Group, "id" | "size">;
}

const Avatar = ({
  student = {ref: "", profile_picture: ""},
}: Readonly<AvatarProps>) => {
  const [isLoaded, setLoaded] = useState(false);

  return (
    <MuiAvatar
      alt={student.ref}
      src={isLoaded ? student.profile_picture : defaultProfilePicture}
      onLoad={() => setLoaded(true)}
    />
  );
};

const AvatarGroup = ({group = {id: ""}}: Readonly<AvatarGroupProps>) => {
  const {data: students = []} = useGetList<ToRaRecord<Student>>(
    "group-students",
    {
      meta: {groupId: group?.id},
    }
  );

  return (
    <MuiAvatarGroup max={4} total={group?.size}>
      {students.map((student) => (
        <Avatar key={student.ref} student={student} />
      ))}
    </MuiAvatarGroup>
  );
};

const Actions = () => {
  const {isManager, isAdmin} = useRole();

  return (
    <Box>
      {(isManager() || isAdmin()) && <CreateButton />}
      <ExportButton />
      <GroupFilters />
    </Box>
  );
};

const GroupList = () => {
  const {data: stats = LOADING_STATS} = useGetOne<UsersStats>("stats", {
    id: NOOP_ID,
    meta: {resource: "users"},
  });

  const headerCardContent = [
    {
      title: "Groupes",
      icon: <GroupIcon fontSize="medium" />,
      total: stats.total_groups,
    },
    ...getCommonListHeaderContent(stats),
  ];
  const {isManager, isAdmin} = useRole();

  return (
    <Box>
      <ListHeader
        title="Liste des groupes"
        cardContents={headerCardContent}
        action={
          <RaCreateButton
            {...COMMON_BUTTON_PROPS}
            size="medium"
            sx={{
              m: "0px",
            }}
          />
        }
      />
      <HaList
        listProps={{title: "Groupes"}}
        resource="groups"
        title="Liste des groupes"
        mainSearch={{label: "Référence d'un étudiant", source: "student_ref"}}
        icon={<GroupIcon />}
        actions={<Actions />}
      >
        <FunctionField<GroupRecord>
          source="ref"
          label="Référence"
          render={(group) => (
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
              {group?.ref.slice(0, 3)}
            </MuiAvatar>
          )}
        />
        <TextField source="name" label="Nom" />
        <DateField
          source="creation_datetime"
          label="Date de création"
          showTime={false}
        />
        <FunctionField<GroupRecord>
          label="Étudiants"
          render={(group) => <AvatarGroup group={group} />}
        />
        <Box display="flex" justifyContent="space-evenly">
          <ShowButton />
          {(isAdmin() || isManager()) && (
            <EditButton sx={{color: PALETTE_COLORS.yellow}} />
          )}
        </Box>
      </HaList>
    </Box>
  );
};

export default GroupList;
