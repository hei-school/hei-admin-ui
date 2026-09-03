import defaultCoverPicture from "@/assets/banner.jpg";
import {PALETTE_COLORS} from "@/haTheme";
import {Group, RoleEnum} from "@haapi-b0fc7615/typescript-client";
import {Box, Typography, useMediaQuery} from "@mui/material";
import {useGetOne, useShowContext} from "react-admin";
import {Informations} from "./profilContent/InformationContent";
import {ProfileCardAvatar} from "./profilContent/ProfilCardAvatar";

export const ProfileLayout = ({
  role,
  actions,
  isTeacherProfile = false,
  isStudentProfile = false,
  isMonitorProfile = false,
  isStaffProfil = false,
}: {
  role: RoleEnum;
  actions: React.ReactNode;
  isTeacherProfile?: boolean;
  isStudentProfile?: boolean;
  isMonitorProfile?: boolean;
  isStaffProfil?: boolean;
  isAdminProfile?: boolean;
}) => {
  const {record: profile = {}} = useShowContext();
  const isLarge = useMediaQuery("(min-width:1700px)");
  const {groups = []} = profile;
  const {data: credit} = useGetOne(
    "credits",
    {id: profile.id},
    {
      enabled: isStudentProfile && !!profile.id,
    }
  );
  return (
    <Box
      border={`1px solid ${PALETTE_COLORS.grey}`}
      borderRadius="10px"
      position="relative"
    >
      {/* Cover */}
      <Box
        height={isLarge ? "15rem" : "10rem"}
        width="100%"
        borderRadius="10px 10px 0 0"
        sx={{
          backgroundImage: `url(${defaultCoverPicture})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
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
          height="100%"
          flexShrink={0}
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
        {isStudentProfile && credit?.amount > 0 && (
          <Box
            flex={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            paddingInline={3}
          >
            <Box
              textAlign="center"
              sx={{
                minWidth: {
                  xs: "150px",
                  sm: "180px",
                  md: "220px",
                },
                padding: "0.8rem 1.5rem",
                border: `1px solid ${PALETTE_COLORS.grey}`,
                borderRadius: "12px",
                backgroundColor: "#ffffff",
              }}
            >
              <Typography
                fontSize={{
                  xs: "0.65rem",
                  sm: "0.75rem",
                  md: "0.85rem",
                  lg: "0.9rem",
                  xl: "1rem",
                }}
                fontWeight="500"
              >
                Crédit actuel
              </Typography>
              <Typography
                fontWeight="700"
                fontSize={{
                  xs: "0.9rem",
                  sm: "1rem",
                  md: "1.1rem",
                  lg: "1.2rem",
                  xl: "1.3rem",
                }}
              >
                {credit.amount.toLocaleString("fr-FR")} Ar
              </Typography>
            </Box>
          </Box>
        )}
        <Box flexShrink={0}>{actions}</Box>
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
