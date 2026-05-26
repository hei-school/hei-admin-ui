import authProvider from "@/providers/authProvider";
import {AlertBar} from "@/ui/components";
import {CourseResultStatus} from "@haapi-b0fc7615/typescript-client";
import {AlertCircle} from "lucide-react";

export const ListRetakeExamsForStudentSpecificBar = ({
  onClick,
}: {
  onClick?: () => void;
}) => {
  const studentId = authProvider.getCachedWhoami().id;
  return (
    <AlertBar
      resource="student-retake-exams"
      filter={{studentId: studentId, status: CourseResultStatus.INCOMPLETE}}
      title="Liste de mes rattrapages à faire"
      icon={AlertCircle}
      navigateTo="/student/retake-exams"
      onClick={onClick}
    />
  );
};
