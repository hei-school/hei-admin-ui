import {useEffect, useRef, useState} from "react";
import {Typography, Box, CircularProgress, useMediaQuery} from "@mui/material";
import {CalendarMonth} from "@mui/icons-material";
import {styled} from "@mui/styles";
import {useDataProvider} from "react-admin";

// /!\ TODO: refactor with path alias
import {getUserRoleInFr} from "../../../operations/common/utils/typo_util";
import {PALETTE_COLORS} from "../../constants/palette";
import authProvider from "../../../providers/authProvider";
import defaultProfilePicture from "../../../assets/blank-profile-photo.png";

const HEI_CALENDAR_URL = "http://calendar.hei.school/";
const StyledUserInfo = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: 20,
});

function UserInfo() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({});
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
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
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
      data-testid="appbar-profile-pic"
      ref={imgRef}
      src={profile_picture}
      onError={() => {
        if (imgRef.current) {
          imgRef.current.src = defaultProfilePicture;
        }
      }}
      alt="profile picture"
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
              {!isLoading && role && getUserRoleInFr(role)}
            </Typography>
          </Box>
          <a href={HEI_CALENDAR_URL} target="_blank">
            <CalendarMonth
              sx={{color: PALETTE_COLORS.primary, fontSize: "35px", mt: 0.5}}
            />
          </a>
        </>
      )}
    </StyledUserInfo>
  );
}

export default UserInfo;
