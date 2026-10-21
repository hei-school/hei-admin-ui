import {RetakeExamSession} from "@haapi-3d601c85/typescript-client";
import {Edit} from "react-admin";
import {
  RetakeExamSessionForm,
  transformRetakeExamSession,
} from "./components/RetakeExamSessionForm";

interface RetakeExamSessionEditProps extends RetakeExamSession {
  onSuccess?: () => void;
}

export const RetakeExamSessionEdit = ({
  onSuccess,
  ...props
}: RetakeExamSessionEditProps) => (
  <Edit
    title=" "
    transform={transformRetakeExamSession}
    actions={<></>}
    mutationMode="pessimistic"
    mutationOptions={{
      onSuccess: () => {
        onSuccess?.();
      },
    }}
    {...props}
  >
    <RetakeExamSessionForm />
  </Edit>
);
