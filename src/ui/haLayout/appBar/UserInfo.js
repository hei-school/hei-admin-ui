import { Typography, Box, CircularProgress } from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";
import { styled } from "@mui/styles";
import { useGetOne } from "react-admin";

// /!\ TODO: refactor with path alias
import { PALETTE_COLORS } from "../../constants/palette";
import authProvider from "../../../providers/authProvider";
import defaultProfilePicture from "../../../assets/blank-profile-photo.png";
import { useRef } from "react";

const HEI_CALENDAR_URL = "http://calendar.hei.school/";
const StyledUserInfo = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: 20
});

function UserInfo() {
  const imgRef = useRef(null);

  const { data: user = {}, isLoading } = useGetOne("profile", {
    id: authProvider.getCachedWhoami().id,
  });
  const { first_name = "", profile_picture = defaultProfilePicture } = user;
  
  if (isLoading) {
    return (
      <CircularProgress
        size={40}
        style={{ margin: "7px" }}
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
      <Box sx={{ display: 'flex', fontSize: '14px', justifyContent: "center", alignItems: "start", flexDirection: "column" }}>
        <Typography
          sx={{
            fontWeight: 'bold',
            fontSize: "inherit",
            lineHeight: 1.2,
            color: PALETTE_COLORS.black
          }}>
          {first_name}
        </Typography>
        <Typography sx={{ color: PALETTE_COLORS.black, fontSize: "inherit", lineHeight: 1.2 }}>Manager</Typography>
      </Box>
      <a href={HEI_CALENDAR_URL} target="_blank">
        <CalendarMonth sx={{ color: PALETTE_COLORS.primary, fontSize: "35px", mt: .5 }} />
      </a>
    </StyledUserInfo>
  );
}

export default UserInfo;
