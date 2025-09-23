import {EnrollButton} from "@/operations/retakeExams/components/EnrollButton";
import {RetakeExamSuccessCard} from "@/operations/retakeExams/components/RetakeExamSuccessCard";
import authProvider from "@/providers/authProvider";
import {HaList} from "@/ui/haList";
import {RetakeExam} from "@haapi-b0fc7615/typescript-client";
import {Box} from "@mui/material";
import {BookOpenIcon} from "lucide-react";
import {DateField, TextField, useStore} from "react-admin";

const RETAKE_EXAM_LIST_SX = {
  "& .RaList-content": {
    "& .MuiTableRow-root": {
      "cursor": "default !important",
      "pointerEvents": "none",
      "&:hover": {backgroundColor: "transparent !important"},
      "&.Mui-selected": {backgroundColor: "transparent !important"},
      "& .MuiButton-root, & button": {pointerEvents: "auto"},
    },
    "& .MuiTableCell-root": {
      "cursor": "default !important",
      "&:hover": {backgroundColor: "transparent !important"},
      "& .MuiButton-root, & button": {pointerEvents: "auto"},
    },
  },
  "& .MuiTableCell-root": {
    userSelect: "text",
    cursor: "default !important",
  },
};

const SUCCESS_CARD_CONTAINER_SX = {
  "display": "flex",
  "gap": 2,
  "mt": 3,
  "overflowX": "auto",
  "pb": 1,
  "&::-webkit-scrollbar": {height: 6},
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
  },
  "&::-webkit-scrollbar-thumb": {
    "backgroundColor": "#c1c1c1",
    "borderRadius": 10,
    "&:hover": {backgroundColor: "#a8a8a8"},
  },
};

export const RetakeExamList = () => {
  const userId = authProvider.getCachedWhoami()?.id;
  const storeKey = `inscribed-retake-exams-${userId}`;
  const [inscribedRetakeExams, setInscribedRetakeExams] = useStore<
    RetakeExam[]
  >(storeKey, []);

  const sessionId = (retakeExam: RetakeExam) => {
    return retakeExam.session?.id;
  };

  const isRetakeExamInscribed = (retakeExam: RetakeExam) =>
    inscribedRetakeExams.some(
      (item) => item.course?.id === retakeExam.course?.id
    );

  const handleInscriptionSuccess = (retakeExam: RetakeExam) => {
    if (isRetakeExamInscribed(retakeExam)) return;
    setInscribedRetakeExams((prev) => [...prev, retakeExam]);
  };

  return (
    <Box>
      <HaList
        title="Listes de mes rattrapages"
        resource="retakeExams"
        icon={<BookOpenIcon />}
        listProps={{
          title: "Rattrapages",
          filter: {
            studentId: userId,
            sessionId: sessionId,
          },
          disableRowClick: true,
          rowClick: false,
          sx: RETAKE_EXAM_LIST_SX,
        }}
      >
        <TextField source="course.code" label="Matière" />
        <TextField source="course.name" label="Nom du cours" />
        <DateField source="session.date_from" label="Début" />
        <DateField source="session.date_to" label="Fin" />

        <EnrollButton
          onSuccess={handleInscriptionSuccess}
          alreadyInscribed={isRetakeExamInscribed}
        />
      </HaList>

      {inscribedRetakeExams.length > 0 && (
        <Box sx={SUCCESS_CARD_CONTAINER_SX}>
          {inscribedRetakeExams.map((retakeExam, index) => (
            <RetakeExamSuccessCard
              key={`${retakeExam.course?.code}-${retakeExam.session?.id || index}`}
              retakeExam={retakeExam}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
