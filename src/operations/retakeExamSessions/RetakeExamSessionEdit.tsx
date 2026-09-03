import {RetakeExamSession} from "@haapi-b0fc7615/typescript-client";
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
