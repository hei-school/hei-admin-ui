import {WORK_TYPE_VALUE} from "@/operations/docs/components/SelectWorkType";
import {User} from "@/providers/types";
import {useRole} from "@/security/hooks";
import {StaffMember, Student} from "@haapi/typescript-client";
import {
  CalendarTodayOutlined as CalendarIcon,
  CurrencyExchange,
  Engineering,
  MedicationLiquid,
  PersonOutlined as PersonIcon,
  School as SchoolIcon,
  AssignmentOutlined as SpecializationIcon,
  HowToRegOutlined as StatusIcon,
  WorkOff,
  WorkspacePremium,
  CardTravel as WorkStatusIcon,
} from "@mui/icons-material";
import {Box, useMediaQuery} from "@mui/material";
import {FC} from "react";
import HaField from "../fields/HaField";
import {HaDateField} from "../HaDateField";
import {Title} from "../Title";
import {
  renderExperienceDuration,
  renderSpecialization,
  renderWorkStatus,
} from "./utils";

export const PersonalInfos: FC<{
  isStudentProfile: boolean;
  isStaffMember: boolean;
}> = ({isStudentProfile, isStaffMember}) => {
  const isSmall = useMediaQuery("(max-width:900px)");
  const role = useRole();
  const isStaffMemberProfile = isStaffMember || role.isStaffMember();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
        width: isSmall ? "100%" : "50%",
        minHeight: "100%",
        padding: "1rem",
        borderRadius: "10px",
      }}
    >
      <Title label="Informations personnelles" />
      <Box display="flex" flexDirection="column" gap={1}>
        <HaField
          label="Date d'entrée chez HEI"
          icon={<CalendarIcon />}
          render={(user: User) => (
            <HaDateField value={user.entrance_datetime} />
          )}
          source={undefined}
        />
        {isStudentProfile && (
          <Box display="flex" flexDirection="column" gap={1}>
            <HaField
              label="Redoublant"
              render={(user: User & Student) =>
                user.is_repeating_year ? "Oui" : "Non"
              }
              icon={<PersonIcon />}
              source={undefined}
            />
            <HaField
              label="Parcours de Spécialisation"
              render={(user: User & Student) =>
                renderSpecialization(user.specialization_field!)
              }
              icon={<SpecializationIcon />}
              source={undefined}
            />
            <HaField
              label="Statut professionnel"
              icon={<StatusIcon />}
              render={(user: User & Student) =>
                renderWorkStatus(user.work_study_status!)
              }
              source={undefined}
            />
            <HaField
              label="Type d'expérience professionnelle"
              render={(user: User & Student) =>
                WORK_TYPE_VALUE[user.professional_experience!] ??
                "Pas d'expérience professionnelle"
              }
              icon={<WorkStatusIcon />}
              source={undefined}
            />
            <HaField
              label="Période de l'expérience professionnelle"
              icon={<CalendarIcon />}
              render={renderExperienceDuration}
              source={undefined}
            />
            <HaField
              label="Lycée de provenance"
              icon={<SchoolIcon />}
              source="high_school_origin"
              render={undefined}
            />
          </Box>
        )}
        {isStaffMemberProfile && (
          <Box>
            <HaField
              label="Cnaps"
              icon={<CurrencyExchange />}
              source="cnaps"
              render={undefined}
            />
            <HaField
              label="Ostie"
              icon={<MedicationLiquid />}
              source="ostie"
              render={undefined}
            />
            <HaField
              label="Poste chez HEI"
              icon={<Engineering />}
              source="function"
              render={undefined}
            />
            <HaField
              label="Diplôme"
              icon={<WorkspacePremium />}
              source="degree"
              render={undefined}
            />
            <HaField
              label="Fin de service"
              icon={<WorkOff />}
              render={(user: User & StaffMember) => (
                <HaDateField value={user.ending_service} />
              )}
              source={undefined}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
