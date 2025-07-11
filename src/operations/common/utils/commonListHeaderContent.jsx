import {
  PersonOff as DisabledIcon,
  CheckCircle as EnabledIcon,
  Female as FemaleIcon,
  Male as MaleIcon,
  Diversity2 as StudentIcon,
  PersonRemove as SuspendedIcon,
} from "@mui/icons-material";

export const getCommonListHeaderContent = (stats) => {
  const totalStudents = stats.men.total + stats.women.total;
  return [
    {
      title: "Étudiants",
      icon: <StudentIcon fontSize="large" />,
      total: isNaN(totalStudents) ? 0 : totalStudents,
      statDetails: [
        {
          icon: <EnabledIcon fontSize="small" color="success" />,
          total: (stats.women.enabled ?? 0) + (stats.men.enabled ?? 0),
          title: "Actif.ve.s",
        },
        {
          icon: <SuspendedIcon fontSize="small" color="warning" />,
          total: (stats.women.suspended ?? 0) + (stats.men.suspended ?? 0),
          title: "Suspendu.e.s",
        },
        {
          icon: <DisabledIcon fontSize="small" color="error" />,
          total: (stats.women.disabled ?? 0) + (stats.men.disabled ?? 0),
          title: "Quitté.e.s",
        },
      ],
    },
    {
      title: "Femmes",
      icon: <FemaleIcon fontSize="large" />,
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
      icon: <MaleIcon fontSize="large" />,
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
