import {PALETTE_COLORS} from "@/haTheme";
import {formatDate} from "@/utils/date";
import {Exam} from "@haapi/typescript-client";
import {
  ImportContactsOutlined as BookIcon,
  PeopleOutline as GroupIcon,
  PermIdentityOutlined as PersonIcon,
} from "@mui/icons-material";
import {
  Box,
  CardContent,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import {Clock} from "lucide-react";
import {CSSProperties, FC, ReactNode} from "react";
import {Link} from "react-admin";

type ExamDetailsProps = {
  exam: Exam;
};

type InfoRowProps = {
  icon: ReactNode;
  label: string;
  value?: string;
  color?: string;
  textColor?: string;
};

type ExamTagProps = {
  label: string;
  color: string;
};

type ExamCardProps = {
  exam: Exam;
  isLoading: boolean;
};

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

const ExamDetails: FC<ExamDetailsProps> = ({exam}) => (
  <Stack direction="column" spacing={1} mt={2}>
    <InfoRow
      label="Cours:"
      color="#f4e1ac"
      textColor={PALETTE_COLORS.black}
      value={exam?.course_assignment?.course?.code}
      icon={<BookIcon sx={{fontSize: "1.5rem", mr: "5px"}} />}
    />
    <InfoRow
      label="Groupe:"
      value={
        exam?.course_assignment?.groups?.map((group) => group.ref).join(", ") ||
        "non défini"
      }
      icon={<GroupIcon sx={{fontSize: "1.5rem", mr: "5px"}} />}
    />

    <InfoRow
      label="Enseignant:"
      color="#f4e1ac"
      textColor={PALETTE_COLORS.black}
      value={`${exam?.course_assignment?.main_teacher?.first_name ?? exam?.course_assignment?.main_teacher?.last_name ?? "non défini"}`}
      icon={<PersonIcon sx={{fontSize: "1.5rem", mr: "5px"}} />}
    />
  </Stack>
);

const InfoRow: FC<InfoRowProps> = ({
  icon,
  label,
  value,
  color = "primary.light",
  textColor = "white",
}) => (
  <Box display="flex" justifyContent="space-between">
    <Typography display="flex" alignItems="center">
      {icon} {label}
    </Typography>
    <Box
      bgcolor={color}
      color={textColor}
      py="3px"
      display="flex"
      fontSize="14px"
      fontWeight="bold"
      alignItems="center"
      whiteSpace="nowrap"
      width="fit-content"
      textOverflow="ellipsis"
      textTransform="uppercase"
      borderRadius={20}
      px={1}
    >
      {value}
    </Box>
  </Box>
);

const ExamTag: FC<ExamTagProps> = ({label, color}) => (
  <Box
    py="3px"
    color="white"
    fontSize="14px"
    fontWeight="bold"
    overflow="hidden"
    whiteSpace="nowrap"
    display="inline-block"
    minWidth="fit-content"
    textOverflow="ellipsis"
    borderRadius={20}
    bgcolor={color}
    px={1.5}
  >
    {label}
  </Box>
);

export const ExamCard: FC<ExamCardProps> = ({exam, isLoading}) => (
  <Link
    to={`/exams/${exam.id}/grades`}
    data-testid="exam-card"
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
            label={`Coef. ${exam.coefficient}`}
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
