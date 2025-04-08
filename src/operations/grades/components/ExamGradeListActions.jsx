import {
  GRADE_HEADERS,
  transformGradesData,
  validateGradeData,
} from "@/operations/grades/utils";
import examGradeProvider from "@/providers/examGradeProvider";
import {useRole} from "@/security/hooks";
import {ImportButton} from "@/ui/haToolbar";
import {Box} from "@mui/material";

export const ExamGradeListActions = ({examId}) => {
  const {isManager, isAdmin, isTeacher} = useRole();
  const hasPermission = isManager() || isAdmin() || isTeacher();

  if (!hasPermission) return null;

  const handleImport = async (data) => {
    const flattened = data.flatMap((entry) => entry[1]);
    return await examGradeProvider.saveOrUpdate(flattened, {examId});
  };

  return (
    <Box>
      <ImportButton
        validateData={validateGradeData}
        resource="notes"
        provider={handleImport}
        transformData={transformGradesData}
        minimalHeaders={GRADE_HEADERS.minimal}
        optionalHeaders={GRADE_HEADERS.optional}
      />
    </Box>
  );
};
