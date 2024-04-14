import {useEffect, useRef, useState} from "react";
import {
  Typography,
  Box,
  CircularProgress,
  useMediaQuery,
  Popover,
  IconButton,
  Divider,
  Badge,
  styled,
} from "@mui/material";
import {CalendarMonth, Comment, Feedback} from "@mui/icons-material";
import {useDataProvider} from "react-admin";

// /!\ TODO: refactor with path alias
import {StudentComments} from "../../../operations/comments";
import {getUserRoleInFr} from "../../../operations/common/utils/typo_util";
import {useToggle} from "../../../hooks";
import {useRole} from "../../../security/hooks";
import {PALETTE_COLORS} from "../../constants/palette";
import authProvider from "../../../providers/authProvider";
import defaultProfilePicture from "../../../assets/blank-profile-photo.png";

const HEI_CALENDAR_URL = "http://calendar.hei.school/";

const StyledUserInfo = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: 20,
});

const MAIL_REPORT_DESTINATIONS = [
  "hei.mayah.3@gmail.com",
  "hei.ricka.3@gmail.com",
  "hei.adriano.4@gmail.com",
  "hei.jean.3@gmail.com",
  "hei.iloniavo@gmail.com",
];

const LastComments = () => {
  const [showComments, , toggleShowComments] = useToggle(false);

  return (
    <>
      <IconButton onClick={toggleShowComments}>
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

  const handleClick = (event) => {
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
              {MAIL_REPORT_DESTINATIONS.map((mail, index) => (
                <li key={index}>
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
  const [user, setUser] = useState({});
  const {isStudent} = useRole();
  const imgRef = useRef(null);
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

  const {first_name = "", profile_picture = defaultProfilePicture} = user;

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

  const ProfilePicture = () => (
    <img
      alt="profile"
      data-testid="appbar-profile-pic"
      ref={imgRef}
      src={profile_picture}
      onError={() => {
        if (imgRef.current) {
          imgRef.current.src = defaultProfilePicture;
        }
      }}
      style={{
        objectFit: "cover",
        height: 40,
        width: 40,
        border: `1px solid ${PALETTE_COLORS.grey}`,
        borderRadius: "50%",
      }}
    />
  );

  return (
    <StyledUserInfo>
      <ProfilePicture />
      {!isSmall && (
        <>
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
              {user.sex && getUserRoleInFr(role, user.sex)}
            </Typography>
          </Box>
          <a href={HEI_CALENDAR_URL} rel="noreferrer" target="_blank">
            <CalendarMonth
              sx={{color: PALETTE_COLORS.primary, fontSize: "35px", mt: 0.5}}
            />
          </a>
          {!isStudent() && <LastComments />}
          <FeedbackInfos />
        </>
      )}
    </StyledUserInfo>
  );
}

export default UserInfo;
