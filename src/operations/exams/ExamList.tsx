import {
  ImportContactsOutlined as BookIcon,
  PeopleOutline as GroupIcon,
  PermIdentityOutlined as PersonIcon,
} from "@mui/icons-material";
import {
  Box,
  CardContent,
  Divider,
  LinearProgress,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import {Clock} from "lucide-react";
import {CSSProperties, FC, ReactNode} from "react";
import {Link, List, useListContext} from "react-admin";

import {PALETTE_COLORS} from "@/haTheme";
import {useRole} from "@/security/hooks";
import {ResponsiveGrid} from "@/ui/components";
import {HaListTitle} from "@/ui/haList";
import {PrevNextPagination} from "@/ui/haList/PrevNextPagination";
import {CreateButton} from "@/ui/haToolbar";
import {formatDate} from "@/utils/date";
import {ExamInfo} from "@haapi/typescript-client";

const cardStyle: CSSProperties = {
  minWidth: "300px",
  marginTop: "50px",
  borderRadius: "7px",
  overflow: "visible",
  position: "relative",
  borderTop: "5px solid",
  borderBottom: "5px solid",
  boxShadow: "0 0 10px rgb(182, 182, 182)",
};

export const ExamList = () => {
  const {isManager, isAdmin, isTeacher} = useRole();

  return (
    <List
      sx={{
        "mt": 2,
        "& .RaList-content": {
          boxShadow: "none",
          backgroundColor: "none",
        },
      }}
      title="Liste des examens"
      perPage={12}
      actions={false}
      empty={false}
      pagination={<PrevNextPagination />}
    >
      <ExamLoader />
      <HaListTitle
        filterIndicator
        title="Liste des examens"
        mainSearch={{source: "", label: ""}}
        icon={<BookIcon />}
        actions={(isManager() || isAdmin() || isTeacher()) && <ExamActions />}
      />
      <ExamsGridContent />
    </List>
  );
};

const ExamLoader = () => {
  const {isLoading} = useListContext();
  return isLoading && <LinearProgress />;
};

const ExamActions = () => (
  <Box>
    <CreateButton resource="exams" />
  </Box>
);

const ExamsGridContent = () => {
  const {data: exams = [], isLoading} = useListContext();

  return (
    <ResponsiveGrid gap="1.5rem">
      {exams.map((exam: ExamInfo) => (
        <ExamCard key={exam.id} exam={exam} isLoading={isLoading} />
      ))}
    </ResponsiveGrid>
  );
};

const ExamCard: FC<{exam: ExamInfo; isLoading: boolean}> = ({
  exam,
  isLoading,
}) => (
  <Link
    to={`/exams/${exam.id}/grades`}
    sx={{
      ...cardStyle,
      "width": "100%",
      "maxWidth": "100%",
      "marginBottom": "1rem",
      "boxSizing": "border-box",
      "transition": "0.3s all ease-in-out",
      "borderColor": PALETTE_COLORS.primary,
      "&:hover": {transform: "scale(1.05)"},
    }}
  >
    <CardContent component="div">
      {isLoading && <Skeleton variant="rectangular" width={100} height={100} />}
      <Box
        sx={{
          backgroundColor: PALETTE_COLORS.primary,
          borderRadius: "7px 7px 0 0",
        }}
      />
      <Box>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            color={PALETTE_COLORS.primary}
            noWrap
            padding="1rem"
            textTransform="capitalize"
          >
            {exam.title}
          </Typography>
          <ExamTag
            label={`Coef: ${exam.coefficient}`}
            color={PALETTE_COLORS.yellow}
          />
        </Stack>

        <Box sx={{px: "1rem", pb: "1rem"}}>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <Clock width={20} />
            <Typography variant="subtitle1">
              {formatDate(exam.examination_date)}
            </Typography>
          </Stack>
        </Box>
        <Divider />
        <ExamDetails exam={exam} />
      </Box>
    </CardContent>
  </Link>
);

const ExamDetails = ({exam}: {exam: ExamInfo}) => (
  <Stack direction="column" spacing={1} mt={2}>
    <InfoRow
      icon={<BookIcon sx={{fontSize: "1.5rem", mr: "5px"}} />}
      label="Cours:"
      value={exam?.awarded_course?.course?.code}
      color="#f4e1ac"
      textColor={PALETTE_COLORS.black}
    />
    <InfoRow
      icon={<GroupIcon sx={{fontSize: "1.5rem", mr: "5px"}} />}
      label="Groupe:"
      value={exam?.awarded_course?.group?.ref}
    />
    <InfoRow
      icon={<PersonIcon sx={{fontSize: "1.5rem", mr: "5px"}} />}
      label="Enseignant:"
      value={`${exam?.awarded_course?.main_teacher?.first_name ?? ""} ${exam?.awarded_course?.main_teacher?.last_name ?? ""}`}
      color="#f4e1ac"
      textColor={PALETTE_COLORS.black}
    />
  </Stack>
);

const InfoRow = ({
  icon,
  label,
  value,
  color = "primary.light",
  textColor = "white",
}: {
  icon: ReactNode;
  label: string;
  value?: string;
  color?: string;
  textColor?: string;
}) => (
  <Box display="flex" justifyContent="space-between">
    <Typography display="flex" alignItems="center">
      {icon} {label}
    </Typography>
    <Box
      bgcolor={color}
      color={textColor}
      fontSize="14px"
      fontWeight="bold"
      borderRadius={20}
      px={1}
      py="3px"
      display="flex"
      alignItems="center"
      whiteSpace="nowrap"
      textTransform="uppercase"
      textOverflow="ellipsis"
      width="fit-content"
    >
      {value}
    </Box>
  </Box>
);

const ExamTag = ({label, color}: {label: string; color: string}) => (
  <Box
    bgcolor={color}
    color="white"
    fontSize="14px"
    fontWeight="bold"
    borderRadius={20}
    px={1.5}
    py="3px"
    whiteSpace="nowrap"
    overflow="hidden"
    textOverflow="ellipsis"
    display="inline-block"
    minWidth="fit-content"
  >
    {label}
  </Box>
);
