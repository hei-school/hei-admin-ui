import {CalendarMonth, Comment, Feedback} from "@mui/icons-material";
import {
  Badge,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Popover,
  styled,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {useEffect, useState} from "react";
import {useDataProvider} from "react-admin";

import defaultProfilePicture from "@/assets/blank-profile-photo.png";
import {PALETTE_COLORS} from "@/haTheme";
import {useToggle} from "@/hooks";
import {StudentComments} from "@/operations/comments";
import {getUserRoleInFr} from "@/operations/common/utils/typo_util";
import authProvider from "@/providers/authProvider";
import {useRole} from "@/security/hooks";
import GlobalSearch from "@/ui/haLayout/appBar/GlobalSearch";
import {
  Admin,
  Manager,
  Monitor,
  Organizer,
  StaffMember,
  Student,
  Teacher,
} from "@haapi-3d601c85/typescript-client";
import {ProfilePicture} from "./component/ProfilePicture";

const HEI_CALENDAR_URL = `https://admin.hei.school/calendar`;

const StyledUserInfo = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: 20,
});

const MAIL_REPORT_DESTINATIONS = [
  "toky@mail.hei.school",
  "manitra@mail.hei.school",
  "freddy@mail.hei.school",
];

const LastComments = () => {
  const [showComments, , toggleShowComments] = useToggle(false);

  return (
    <>
      <IconButton data-testid="appbar-comments" onClick={toggleShowComments}>
        <Badge color="error" variant="dot">
          <Comment
            sx={{color: PALETTE_COLORS.primary, fontSize: "35px", mt: 0.5}}
          />
        </Badge>
      </IconButton>
      <StudentComments
        title="Liste des derniers commentaires sur les étudiants"
        onClose={toggleShowComments}
        open={showComments}
      />
    </>
  );
};

const FeedbackInfos = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <IconButton aria-describedby={id} onClick={handleClick}>
        <Feedback
          sx={{color: PALETTE_COLORS.primary, fontSize: "35px", mt: 0.5}}
        />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{padding: 2}}>
          <Typography fontWeight="bold" sx={{color: PALETTE_COLORS.yellow}}>
            Voulez-vous donner un feedback?{" "}
          </Typography>
          <Divider sx={{my: 0.5, bgcolor: PALETTE_COLORS.yellow}} />
          <Typography variant="body2">
            Veuillez envoyer un mail à ces adresses avec comme objet
            <br />
            <strong>[HEI-ADMIN]: FEEDBACK UTILISATEUR</strong> :
            <ul>
              {MAIL_REPORT_DESTINATIONS.map((mail) => (
                <li key={mail}>
                  <a href={`mailto:${mail}`}>{mail}</a>
                </li>
              ))}
            </ul>
          </Typography>
        </Box>
      </Popover>
    </div>
  );
};

function UserInfo() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<
    Teacher | Student | Manager | Organizer | StaffMember | Admin | Monitor
  >();
  const {isManager, isAdmin, isTeacher} = useRole();
  const isSmall = useMediaQuery("(max-width:900px)");
  const role = authProvider.getCachedWhoami().role;
  const id = authProvider.getCachedWhoami().id;
  const dataProvider = useDataProvider();

  useEffect(() => {
    const doEffect = async () => {
      setIsLoading(true);
      await dataProvider
        .getOne("profile", {id})
        .then((result) => {
          setUser(result.data);
          setIsLoading(false);
        })
        .catch(() => {});
    };
    doEffect();
  }, []);

  const {first_name, profile_picture = defaultProfilePicture} = user ?? {};
  const profilePictureSrc = profile_picture ?? defaultProfilePicture;

  if (isLoading) {
    return (
      <CircularProgress
        size={40}
        style={{margin: "7px"}}
        sx={{
          ".MuiCircularProgress-circle": {
            color: PALETTE_COLORS.yellow,
          },
        }}
      />
    );
  }

  return (
    <StyledUserInfo>
      {!isSmall && (
        <>
          {(isAdmin() || isManager()) && <GlobalSearch />}
          <a href={HEI_CALENDAR_URL} rel="noreferrer" target="_blank">
            <CalendarMonth
              sx={{color: PALETTE_COLORS.primary, fontSize: "35px", mt: 0.5}}
            />
          </a>
          {(isManager() || isAdmin() || isTeacher()) && <LastComments />}
          <FeedbackInfos />
          <Box
            sx={{
              display: "flex",
              fontSize: "14px",
              justifyContent: "center",
              alignItems: "start",
              flexDirection: "column",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "inherit",
                lineHeight: 1.2,
                color: PALETTE_COLORS.black,
              }}
            >
              {first_name}
            </Typography>
            <Typography
              sx={{
                color: PALETTE_COLORS.black,
                fontSize: "inherit",
                lineHeight: 1.2,
              }}
            >
              {user?.sex && getUserRoleInFr(role, user.sex)}
            </Typography>
          </Box>
        </>
      )}
      <ProfilePicture
        src={profilePictureSrc}
        firstName={first_name}
        lastName={user?.last_name}
        size={40}
      />
    </StyledUserInfo>
  );
}

export default UserInfo;
