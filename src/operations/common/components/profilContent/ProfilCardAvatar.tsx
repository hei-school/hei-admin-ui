import defaultProfilePicture from "@/assets/blank-profile-photo.png";
import {PALETTE_COLORS} from "@/haTheme";
import {useToggle} from "@/hooks";
import {Create} from "@/operations/common/components/Create";
import {useRole} from "@/security/hooks";
import {NOOP_FN} from "@/utils/noop";
import {RoleParamEnum} from "@haapi/typescript-client";
import {
  Badge,
  Dialog,
  DialogTitle,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import {FC, useRef} from "react";

import {PhotoCamera} from "@mui/icons-material";
import {
  FunctionField,
  ImageField,
  ImageInput,
  SimpleForm,
  useNotify,
  useRecordContext,
} from "react-admin";

const UploadPictureButton = ({
  role,
  onUpload = NOOP_FN,
}: {
  role: RoleParamEnum;
  onUpload?: () => void;
}) => {
  const [isOpen, , toggle] = useToggle();
  const user = useRecordContext();
  const id = user?.id;
  const notify = useNotify();
  const isLarge = useMediaQuery("(min-width:1700px)");
  return (
    <div>
      <IconButton
        data-testid="upload-picture-button"
        onClick={toggle}
        sx={{
          borderRadius: "50%",
          transform: isLarge
            ? "translate(-35px, -35px)"
            : "translate(-30px, -25px)",
          bgcolor: PALETTE_COLORS.grey,
          height: 30,
          width: 30,
        }}
      >
        <PhotoCamera
          sx={{height: 20, width: 20, color: PALETTE_COLORS.yellow}}
        />
      </IconButton>
      <Dialog open={isOpen} onClose={toggle}>
        <DialogTitle color={PALETTE_COLORS.yellow} fontWeight="bold">
          Modifier la photo de profil
        </DialogTitle>
        <Create
          title=" "
          redirect={false}
          resource="profile-picture"
          transform={(user: any) => ({
            rawFile: user?.profile_picture?.rawFile,
            id,
            role,
          })}
          mutationOptions={{
            onSuccess: () => {
              toggle();
              onUpload();
              notify(`Photo mise à jour avec succès!`, {
                type: "success",
              });
            },
          }}
        >
          <SimpleForm>
            <ImageInput
              source="profile_picture"
              label=" "
              accept="image/jpeg,image/png,image/webp"
            >
              <ImageField source="src" title="title" />
            </ImageInput>
          </SimpleForm>
        </Create>
      </Dialog>
    </div>
  );
};

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
