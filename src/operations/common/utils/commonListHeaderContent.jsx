import {
  Group as GroupIcon,
  Diversity2 as StudentIcon,
  Female as FemaleIcon,
  Male as MaleIcon,
  School as SchoolIcon,
  UploadFile as UploadFileIcon,
  Work as WorkIcon,
  CheckCircle as EnabledIcon,
  PersonOff as DisabledIcon,
  PersonRemove as SuspendedIcon,
} from "@mui/icons-material";

export const getCommonListHeaderContent = (stats) => {
  const totalStudents = stats.men.total + stats.women.total;
  return [
    {
      title: "Étudiants",
      icon: <StudentIcon fontSize="medium" />,
      total: isNaN(totalStudents) ? "..." : totalStudents,
      statDetails: [
        {
          icon: <EnabledIcon fontSize="small" color="success" />,
          total: stats.women.enabled + stats.men.enabled ?? "...",
          title: "Actif.ve.s",
        },
        {
          icon: <SuspendedIcon fontSize="small" color="warning" />,
          total: stats.women.suspended + stats.men.suspended ?? "...",
          title: "Suspendu.e.s",
        },
        {
          icon: <DisabledIcon fontSize="small" color="error" />,
          total: stats.women.disabled + stats.men.disabled ?? "...",
          title: "Quitté.e.s",
        },
      ],
    },
    {
      title: "Femmes",
      icon: <FemaleIcon fontSize="medium" />,
      total: stats.women.total,
      statDetails: [
        {
          icon: <EnabledIcon fontSize="small" color="success" />,
          total: stats.women.enabled,
          title: "Actif.ve.s",
        },
        {
          icon: <SuspendedIcon fontSize="small" color="warning" />,
          total: stats.women.suspended,
          title: "Suspendu.e.s",
        },
        {
          icon: <DisabledIcon fontSize="small" color="error" />,
          total: stats.women.disabled,
          title: "Quitté.e.s",
        },
      ],
    },
    {
      title: "Hommes",
      icon: <MaleIcon fontSize="medium" />,
      total: stats.men.total,
      statDetails: [
        {
          icon: <EnabledIcon fontSize="small" color="success" />,
          total: stats.men.enabled,
          title: "Actif.ve.s",
        },
        {
          icon: <SuspendedIcon fontSize="small" color="warning" />,
          total: stats.men.suspended,
          title: "Suspendu.e.s",
        },
        {
          icon: <DisabledIcon fontSize="small" color="error" />,
          total: stats.men.disabled,
          title: "Quitté.e.s",
        },
      ],
    },
  ];
};
