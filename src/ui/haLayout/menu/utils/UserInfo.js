import {useRef} from "react";
import {useGetOne, useRecordContext} from "react-admin";
import {styled} from "@mui/styles";
import {Typography} from "@mui/material";
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

  const ProfilePicture = () => {
    const user = useRecordContext();
    const imgRef = useRef(null);

    return (
      <img
        data-testid="profile-pic"
        ref={imgRef}
        src={user?.profile_picture || defaultProfilePicture}
        onError={() => {
          if (imgRef.current) {
            imgRef.current.src = defaultProfilePicture;
          }
        }}
        alt="profile picture"
        style={{
          objectFit: "cover",
          height: 25,
          width: 25,
          border: `1px solid ${PALETTE_COLORS.grey}`,
          borderRadius: "50%",
        }}
      />
    );
  };
  return (
    <StyledUserInfo>
      <ProfilePicture />
      <Typography sx={{color: "inherit"}}>{name}</Typography>
    </StyledUserInfo>
  );
}

export default UserInfo;
