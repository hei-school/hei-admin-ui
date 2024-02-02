import { Typography, Box } from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";
import { styled } from "@mui/styles";
import { Link, useGetOne } from "react-admin";

// /!\ TODO: refactor with path alias
import { PALETTE_COLORS } from "../../constants/palette";
import authProvider from "../../../providers/authProvider";
import defaultProfilePicture from "../../../assets/blank-profile-photo.png";

const HEI_CALENDAR_URL = "http://calendar.hei.school/";
const StyledUserInfo = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: 20
});

function UserInfo() {
  const profile = useGetOne("profile", { id: authProvider.getCachedWhoami().id });

  const name = profile && profile.data ? profile.data.first_name : "";

  const ProfilePicture = () => (
    <img
      src={profile?.profile_picture || defaultProfilePicture}
      style={{
        objectFit: "cover",
        height: 40,
        width: 40,
        border: `1px solid ${PALETTE_COLORS.grey}`,
        borderRadius: "50%",
      }}
      alt="your profile picture"
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
          {name}
        </Typography>
        <Typography sx={{ color: PALETTE_COLORS.black, fontSize: "inherit", lineHeight: 1.2 }}>Manager</Typography>
      </Box>
      <a href={HEI_CALENDAR_URL} target="_blank">
        <CalendarMonth sx={{ color: PALETTE_COLORS.primary,fontSize: "35px", mt:.5 }} />
      </a>
    </StyledUserInfo>
  );
}

export default UserInfo;
