import {useParams, useLocation} from "react-router-dom";
import {Typography, Box} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {useStudentRef} from "@/hooks";
import {useRole} from "@/security/hooks";
import {DocList as CommonDocList} from "@/operations/docs/components/DocList";
import {useViewType} from "@/operations/docs/hooks/useViewType";
import authProvider from "@/providers/authProvider";
import {useStudentStatus} from "@/hooks/useStudentStatus";

export const DocList = () => {
  const params = useParams();
  const location = useLocation();

  const type = useViewType("LIST");

  const {isStudent, isManager} = useRole();

  const getStudentRef = useStudentRef("studentId");

  let studentRef = isManager() ? getStudentRef?.studentRef : "";

  const studentId = isStudent()
    ? authProvider.getCachedWhoami().id
    : params.studentId;
  const isSuspended = useStudentStatus(studentId);
  return isSuspended ? (
    <Box
      sx={{
        marginTop: "20px",
        margin: "3em",
        padding: "20px",
        border: "1px solid",
        borderColor: "rgb(239 68 68)",
        color: "rgb(239 68 68)",
        borderRadius: "10px",
        backgroundColor: "background.paper",
      }}
    >
      <Typography sx={{display: "flex", alignItems: "center"}}>
        <WarningAmberIcon sx={{marginRight: "1em"}} />
        L'accès à ce document vous est interdit car vous êtes suspendu.
      </Typography>
    </Box>
  ) : (
    <CommonDocList
      owner="STUDENT"
      type={type}
      studentId={studentId}
      studentRef={isManager() && studentRef}
      datagridProps={{
        rowClick: (id) => `${location.pathname}/${id}`,
      }}
    />
  );
};
