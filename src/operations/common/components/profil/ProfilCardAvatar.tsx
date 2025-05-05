import defaultProfilePicture from "@/assets/blank-profile-photo.png";
import {PALETTE_COLORS} from "@/haTheme";
import {useRole} from "@/security/hooks";
import {RoleParamEnum} from "@haapi/typescript-client";
import {Badge, useMediaQuery} from "@mui/material";
import {FC, useRef} from "react";
import {FunctionField, useRecordContext} from "react-admin";
import {UploadPictureButton} from "../ProfileLayout";

export const ProfileCardAvatar: FC<{role: RoleParamEnum}> = ({role}) => {
  const {isStudent, isMonitor} = useRole();

  const user = useRecordContext();
  const imgRef = useRef<HTMLImageElement | null>(null);
  const isLarge = useMediaQuery("(min-width:1700px)");

  const updateImage = (newImage: string) => {
    imgRef.current!.src = newImage;
  };

  return (
    <Badge
      variant="standard"
      badgeContent={
        !isStudent() &&
        !isMonitor() && (
          <UploadPictureButton
            role={role}
            onUpload={() => {
              updateImage(user?.profile_picture);
            }}
          />
        )
      }
      sx={{bgcolor: "transparent", bottom: "5vh"}}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      <FunctionField
        label=" "
        render={() => (
          <img
            alt="profile"
            data-testid="profile-pic"
            ref={imgRef}
            src={user?.profile_picture || defaultProfilePicture}
            onError={() => {
              if (imgRef.current) {
                imgRef.current.src = defaultProfilePicture;
              }
            }}
            style={{
              objectFit: "cover",
              height: isLarge ? 210 : 175,
              width: isLarge ? 210 : 175,
              border: `1px solid ${PALETTE_COLORS.grey}`,
              borderRadius: "50%",
            }}
          />
        )}
      />
    </Badge>
  );
};
