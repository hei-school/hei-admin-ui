import {HaList} from "@/ui/haList";
import {RetakeExamStatus} from "@haapi-b0fc7615/typescript-client";
import {AssignmentLate} from "@mui/icons-material";
import {Box, CircularProgress, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {TextField, useGetList} from "react-admin";
import {useNavigate} from "react-router-dom";
import {Buttons} from "./components/Buttons";

export const CancellationRetakeExam = () => {
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);

  const {data: retakeExams = [], isLoading} = useGetList("retakeExams", {
    filter: {status: RetakeExamStatus.TO_CANCEL},
  });

  const count = retakeExams.length;

  useEffect(() => {
    if (!isLoading && count === 0) {
      setRedirecting(true);
      const timeout = setTimeout(() => {
        navigate("/retakeExams-sessions");
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [count, isLoading, navigate]);

  if (redirecting) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          gap: 2,
        }}
      >
        <CircularProgress size={48} thickness={4} />
        <Typography variant="subtitle1" sx={{mt: 1}}>
          Redirection vers liste des sessions...
        </Typography>
      </Box>
    );
  }

  return (
    <HaList
      resource="retakeExams"
      title="Demandes d'annulation de rattrapage"
      actions={undefined}
      datagridProps={{rowClick: false}}
      listProps={{
        title: "Rattrapages à annuler",
        filter: {status: RetakeExamStatus.TO_CANCEL},
      }}
      icon={<AssignmentLate />}
    >
      <TextField source="student_identifier.first_name" label="Nom" />
      <TextField source="student_identifier.last_name" label="Prénom" />
      <TextField source="student_identifier.ref" label="STD" />
      <TextField source="course.code" label="Matière" />
      <TextField source="session.title" label="Session" />
      <Buttons />
    </HaList>
  );
};
