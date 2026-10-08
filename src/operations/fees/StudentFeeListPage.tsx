import {ToRaRecord} from "@/operations/common/utils/types";
import {useRole} from "@/security/hooks/useRole";
import {Student} from "@haapi-b0fc7615/typescript-client";
import {useGetOne} from "react-admin";
import {useParams} from "react-router-dom";
import FeeList from "./FeeList";

// Route `/students/:studentId/fees` : la liste reçoit l'étudiant de l'URL au
// lieu de props qu'aucune route ne lui passe.
const StudentFeeListPage = () => {
  const {studentId = ""} = useParams<{studentId: string}>();
  const {isStudent} = useRole();
  const {data: student} = useGetOne<ToRaRecord<Student>>(
    "students",
    {id: studentId},
    {enabled: !isStudent() && studentId !== ""}
  );

  return <FeeList studentId={studentId} studentRef={student?.ref ?? ""} />;
};

export default StudentFeeListPage;
