import {SuspendedStudentAlert} from "@/operations/common/components/SuspendedStudentAlert";
import {ToRaRecord} from "@/operations/common/utils/types";
import {
  DocList as CommonDocList,
  DocListAction,
} from "@/operations/docs/components/DocList";
import {useViewType} from "@/operations/docs/hooks/useViewType";
import {useStudentRef} from "@/operations/fees/hooks/useStudentRef";
import authProvider from "@/providers/authProvider";
import {useRole} from "@/security/hooks";
import {FileType, Student} from "@haapi-b0fc7615/typescript-client";
import {Identifier, useGetOne} from "react-admin";
import {useLocation, useParams} from "react-router-dom";
import {getDocListTitle} from "../utils/doc-list-title";

export const DocList = () => {
  const params = useParams();
  const location = useLocation();
  // the LIST route always ends with a FileType segment (see App routes)
  const type = useViewType("LIST") as FileType;
  const {isStudent, isManager, isAdmin, isMonitor} = useRole();
  const getStudentRef = useStudentRef("userId");
  const studentRef = isManager() || isAdmin() ? getStudentRef?.studentRef : "";

  const userId = isStudent()
    ? authProvider.getCachedWhoami().id!
    : params.userId!;

  const {data: studentData} = useGetOne<ToRaRecord<Student>>("students", {
    id: userId,
  });
  const isSuspended = studentData?.status === "SUSPENDED";

  return (isStudent() || isMonitor()) && isSuspended ? (
    <SuspendedStudentAlert
      studentName={
        isMonitor()
          ? `${studentData.first_name} ${studentData.last_name} est`
          : "vous êtes"
      }
      restrictionMessage={
        isMonitor()
          ? `Vous n'avez pas accès à ces documents.`
          : "Vous n'avez pas accès à la liste des documents."
      }
    />
  ) : (
    <CommonDocList
      type={type}
      userId={userId}
      owner="STUDENT"
      title={getDocListTitle("STUDENT", type, studentRef)}
      datagridProps={{
        rowClick: (id: Identifier) => `${location.pathname}/${id}`,
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
