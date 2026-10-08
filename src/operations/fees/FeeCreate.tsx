import {useNotify} from "@/hooks";
import {FeeInputs} from "@/operations/fees/components";
import {createFeesApi, FeeFormValues} from "@/operations/fees/utils/feeFactory";
import {
  Create,
  CreateProps,
  SaveButton,
  SimpleForm,
  Toolbar,
} from "react-admin";
import {useStudentRef} from "./hooks/useStudentRef";

const FeeCreate = (props: Readonly<CreateProps>) => {
  const notify = useNotify();
  const {studentId, studentRef} = useStudentRef("studentId");

  return (
    <Create
      mutationOptions={{
        onError: () => {
          notify("Une erreur s'est produite", {type: "error"});
        },
      }}
      {...props}
      title={`Frais de ${studentRef}`}
      resource="fees"
      redirect={() => `students/${studentId}/show/fees`}
      transform={(fees: FeeFormValues) => createFeesApi(fees, studentId)}
    >
      <SimpleForm
        toolbar={
          <Toolbar>
            <SaveButton alwaysEnable />
          </Toolbar>
        }
      >
        <FeeInputs />
      </SimpleForm>
    </Create>
  );
};

export default FeeCreate;
