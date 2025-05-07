import {useShowContext} from "react-admin";

import {Box, Typography, useMediaQuery} from "@mui/material";

import {PALETTE_COLORS} from "@/haTheme";

import defaultCoverPicture from "@/assets/banner.jpg";
import {Group, RoleParamEnum} from "@haapi/typescript-client";
import {FC} from "react";
import {Informations} from "./profilContent/InformationContent";
import {ProfileCardAvatar} from "./profilContent/ProfilCardAvatar";

export const ProfileLayout: FC<{
  role: RoleParamEnum;
  actions: React.ReactNode;
  isTeacherProfile?: boolean;
  isStudentProfile?: boolean;
  isMonitorProfile?: boolean;
  isStaffProfil?: boolean;
  isAdminProfile?: boolean;
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
