import { useWhoami } from "@/security/hooks/useWhoami";
import { HaList } from "@/ui/haList";
import { Box } from "@mui/material";
import { BookOpenIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { DateField, TextField } from "react-admin";
import { InscriptionButton } from "./components/InscriptionButton";
import { SuccessCard } from "./components/SuccesCard";

const listSx = {
  "& .RaList-content": {
    "& .MuiTableRow-root": {
      "cursor": "default !important",
      "pointerEvents": "none",
      "&:hover": { backgroundColor: "transparent !important" },
      "&.Mui-selected": { backgroundColor: "transparent !important" },
      "& .MuiButton-root, & button": { pointerEvents: "auto" },
    },
    "& .MuiTableCell-root": {
      "cursor": "default !important",
      "&:hover": { backgroundColor: "transparent !important" },
      "& .MuiButton-root, & button": { pointerEvents: "auto" },
    },
  },
  "& .MuiTableCell-root": {
    userSelect: "text",
    cursor: "default !important",
  },
};

const successCardContainerSx = {
  "display": "flex",
  "gap": 2,
  "mt": 3,
  "overflowX": "auto",
  "pb": 1,
  "&::-webkit-scrollbar": { height: 6 },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
  },
  "&::-webkit-scrollbar-thumb": {
    "backgroundColor": "#c1c1c1",
    "borderRadius": 10,
    "&:hover": { backgroundColor: "#a8a8a8" },
  },
};

export const RetakeExamList = () => {
  const { id: whoamiId } = useWhoami();

  const [inscribedRecords, setInscribedRecords] = useState(() => {
    const saved = localStorage.getItem("inscribed-retake-exams");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "inscribed-retake-exams",
      JSON.stringify(inscribedRecords)
    );
  }, [inscribedRecords]);

  const handleInscriptionSuccess = (record: any) => {
    const isAlreadyInscribed = inscribedRecords.some(
      (item: any) =>
        item.session?.id === record.session?.id &&
        item.course?.code === record.course?.code
    );

    if (!isAlreadyInscribed) {
      setInscribedRecords((prev: any) => [...prev, record]);
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
          queryOptions: {
            meta: {
              studentId: "STD3393443586",
              sessionId: "session-2025-1",
            },
          },
          disableRowClick: true,
          rowClick: false,
          sx: listSx,
        }}
      >
        <TextField source="course.code" label="Matière" />
        <TextField source="course.name" label="Nom du cours" />
        <DateField source="session.date_from" label="Début" />
        <DateField source="session.date_to" label="Fin" />
        <InscriptionButton onSuccess={handleInscriptionSuccess} />
      </HaList>

      {inscribedRecords.length > 0 && (
        <Box sx={successCardContainerSx}>
          {inscribedRecords.map((record: any, index: any) => (
            <SuccessCard
              key={`${record.course?.code}-${record.session?.id || index}`}
              record={record}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
