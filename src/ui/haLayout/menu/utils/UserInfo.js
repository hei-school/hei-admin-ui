import {Typography} from "@mui/material";
import {styled} from "@mui/styles";
import {useGetOne} from "react-admin";
import {PALETTE_COLORS} from "../../../constants/palette";
import authProvider from "../../../../providers/authProvider";
import defaultProfilePicture from "../../../../assets/blank-profile-photo.png";

const StyledUserInfo = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: 15,
  padding: "10px 0",
  width: "100%",
  color: PALETTE_COLORS.white,
});

function UserInfo() {
  const profile = useGetOne("profile", {id: authProvider.getCachedWhoami().id});

  const name = profile && profile.data ? profile.data.first_name : "";

  const ProfilePicture = () => (
    <img
      src={profile?.profile_picture || defaultProfilePicture}
      style={{
        objectFit: "cover",
        height: 25,
        width: 25,
        border: `1px solid ${PALETTE_COLORS.grey}`,
        borderRadius: "50%",
      }}
      alt="your profile picture"
    />
  );

  return (
    <StyledUserInfo>
      <ProfilePicture />
      <Typography sx={{color: "inherit"}}>{name}</Typography>
    </StyledUserInfo>
  );
}

export default UserInfo;
