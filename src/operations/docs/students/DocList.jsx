import {useParams, useLocation} from "react-router-dom";
import {Box, Typography} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {useStudentRef} from "@/hooks";
import {useRole} from "@/security/hooks";
import {
  DocList as CommonDocList,
  DocListAction,
} from "@/operations/docs/components/DocList";
import {useViewType} from "@/operations/docs/hooks/useViewType";
import authProvider from "@/providers/authProvider";
import {useGetOne} from "react-admin";
import {getDocListTitle} from "../utils/doc-list-title";

export const DocList = () => {
  const params = useParams();
  const location = useLocation();
  const type = useViewType("LIST");
  const {isStudent, isManager, isAdmin} = useRole();
  const getStudentRef = useStudentRef("userId");
  const studentRef = isManager() || isAdmin() ? getStudentRef?.studentRef : "";

  const userId = isStudent()
    ? authProvider.getCachedWhoami().id
    : params.userId;

  const {data: studentData} = useGetOne("students", {id: userId});
  const isSuspended = studentData?.status === "SUSPENDED";

  return isStudent() && isSuspended ? (
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
      type={type}
      userId={userId}
      owner="STUDENT"
      title={getDocListTitle("STUDENT", type, studentRef)}
      datagridProps={{
        rowClick: (id) => `${location.pathname}/${id}`,
      }}
      haListProps={{
        actions:
          isManager() || isAdmin() ? (
            <DocListAction userId={userId} owner="STUDENT" type={type} />
          ) : null,
      }}
    />
  );
};
