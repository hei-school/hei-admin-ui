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
  const {id: whoamiId} = authProvider.getCachedWhoami();
  const storeKey = `inscribed-retake-exams-${whoamiId}`;
  const [inscribedRecords, setInscribedRecords] = useStore<RetakeExam[]>(
    storeKey,
    []
  );

  const isRecordInscribed = (record: RetakeExam) =>
    inscribedRecords.some(
      (item) =>
        item.session?.id === record.session?.id &&
        item.course?.id === record.course?.id
    );

  const handleInscriptionSuccess = (record: RetakeExam) => {
    if (!isRecordInscribed(record)) {
      setInscribedRecords((prev) => [...prev, record]);
    }
  };

  return (
    <Box>
      <HaList
        title="Listes de mes rattrapages"
        resource="retakeExams"
        actions={undefined}
        icon={<BookOpenIcon />}
        listProps={{
          title: "Rattrapages",
          perPage: 10,
          filter: {
            studentId: whoamiId,
            sessionId: "default_session",
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
          alreadyInscribed={isRecordInscribed}
        />
      </HaList>

      {``.length > 0 && (
        <Box sx={SUCCESS_CARD_CONTAINER_SX}>
          {inscribedRecords.map((record, index) => (
            <RetakeExamSuccessCard
              key={`${record.course?.code}-${record.session?.id || index}`}
              record={record}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
