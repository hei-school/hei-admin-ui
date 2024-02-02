import {useRef} from "react";
import {useGetOne} from "react-admin";
import {styled} from "@mui/styles";
import {Typography, CircularProgress} from "@mui/material";
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
  const imgRef = useRef(null);

  const {data: user = {}, isLoading} = useGetOne("profile", {
    id: authProvider.getCachedWhoami().id,
  });
  const {first_name = "", profile_picture = defaultProfilePicture} = user;

  if (isLoading)
    return (
      <CircularProgress
        size={25}
        style={{margin: "7px"}}
        sx={{
          ".MuiCircularProgress-circle": {
            color: PALETTE_COLORS.yellow,
          },
        }}
      />
    );

  return (
    <StyledUserInfo>
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
          height: 25,
          width: 25,
          border: `1px solid ${PALETTE_COLORS.grey}`,
          borderRadius: "50%",
        }}
      />
      <Typography sx={{color: "inherit"}}>{first_name}</Typography>
    </StyledUserInfo>
  );
}

export default UserInfo;
