import {Create, SaveButton, SimpleForm, Toolbar} from "react-admin";
import {useNotify, useStudentRef} from "../../hooks";
import {FeeInputs} from "./components";
import {createFeesApi} from "./utils/feeFactory";

export default function FeeCreate(props) {
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
      redirect={() => `students/${studentId}/fees`}
      transform={(fees) => createFeesApi(fees, studentId)}
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
}
