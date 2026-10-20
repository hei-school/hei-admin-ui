import {RetakeExamSession} from "@haapi-3d601c85/typescript-client";
import {Create} from "react-admin";
import {
  RetakeExamSessionForm,
  transformRetakeExamSession,
} from "./components/RetakeExamSessionForm";

interface RetakeExamSessionCreateProps extends Partial<RetakeExamSession> {
  onSuccess?: () => void;
}

export const RetakeExamSessionCreate = ({
  onSuccess,
  ...props
}: RetakeExamSessionCreateProps) => (
  <Create
    redirect={false}
    title=" "
    transform={transformRetakeExamSession}
    mutationOptions={{
      onSuccess: () => {
        onSuccess?.();
      },
    }}
    {...props}
  >
    <RetakeExamSessionForm />
  </Create>
);
