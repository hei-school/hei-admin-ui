import {
  ImageField,
  ImageInput,
  SimpleForm,
  useRecordContext,
  useShowContext,
} from "react-admin";

import {PhotoCamera} from "@mui/icons-material";

import {
  Box,
  Dialog,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";

import {Create} from "@/operations/common/components/Create";

import {PALETTE_COLORS} from "@/haTheme";
import {useNotify, useToggle} from "@/hooks";
import {NOOP_FN} from "@/utils/noop";

import defaultCoverPicture from "@/assets/banner.jpg";
import {Group, RoleParamEnum} from "@haapi/typescript-client";
import {FC} from "react";
import {Informations} from "./profilContent/InformationContent";
import {ProfileCardAvatar} from "./profilContent/ProfilCardAvatar";

export const UploadPictureButton = ({
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

export const ProfileLayout: FC<{
  role: RoleParamEnum;
  actions: React.ReactNode;
  isTeacherProfile?: boolean;
  isStudentProfile?: boolean;
  isMonitorProfile?: boolean;
  isStaffProfil?: boolean;
}> = ({
  role,
  actions,
  isTeacherProfile = false,
  isStudentProfile = false,
  isMonitorProfile = false,
  isStaffProfil = false,
}) => {
  const {record: profile = {}} = useShowContext();
  const isLarge = useMediaQuery("(min-width:1700px)");
  const {groups = []} = profile;

  return (
    <Box
      border={`1px solid ${PALETTE_COLORS.grey}`}
      borderRadius="10px"
      position="relative"
    >
      <Box
        height={isLarge ? "15rem" : "10rem"}
        width="100%"
        borderRadius="10px 10px 0 0"
        sx={{
          backgroundImage: `url(${defaultCoverPicture})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        paddingInline="2vw"
        height="7rem"
        position="relative"
        sx={{
          backgroundColor: "#f0f0f0",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          position="relative"
          height="100%"
        >
          <ProfileCardAvatar role={role} />
          <Box>
            <Typography
              fontWeight="600"
              fontSize={{
                xs: "1rem",
                sm: "1.2rem",
                md: "1.4rem",
                lg: "1.6rem",
                xl: "1.8rem",
              }}
            >
              {profile.first_name} {profile.last_name}
            </Typography>
            <Typography
              fontSize={{
                xs: "0.8rem",
                sm: "0.9rem",
                md: "1rem",
                lg: "1rem",
                xl: "1.2rem",
              }}
            >
              {profile.ref}
            </Typography>
            {isStudentProfile && (
              <Typography
                fontSize={{
                  xs: "0.4rem",
                  sm: "0.6rem",
                  md: "0.8rem",
                  lg: "0.9rem",
                  xl: "1rem",
                }}
              >
                {groups.map((group: Group) => group.ref).join(", ")}
              </Typography>
            )}
          </Box>
        </Box>
        <Box>{actions}</Box>
      </Box>
      <Informations
        isStudentProfile={isStudentProfile}
        isTeacherProfile={isTeacherProfile}
        isMonitorProfile={isMonitorProfile}
        isStaffProfil={isStaffProfil}
      />
    </Box>
  );
};
