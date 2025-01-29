import {useNotify} from "@/hooks";
import {FeeInputs} from "@/operations/fees/components";
import {createFeesApi} from "@/operations/fees/utils/feeFactory";
import {useState} from "react";
import {Create, SaveButton, SimpleForm, Toolbar} from "react-admin";
import {StudentListWithBulkActions} from "../common/components";

export default function MultipleStudentFeesCreate(props) {
  const notify = useNotify();
  const [studentsIds, setStudentsIds] = useState([]);

  return (
    <Create
      mutationOptions={{
        onError: () => {
          notify("Une erreur s'est produite", {type: "error"});
        },
      }}
      {...props}
      title="Créer des frais pour les étudiants"
      resource="fees"
      redirect={() => `students`}
      transform={(fees) => {
        return studentsIds
          .map((studentId) => createFeesApi(fees, studentId))
          .flat();
      }}
    >
      <SimpleForm
        toolbar={
          <Toolbar>
            <SaveButton alwaysEnable />
          </Toolbar>
        }
      >
        <FeeInputs />
        <StudentListWithBulkActions
          title="Ajoutez les étudiants auxquels vous voulez créer des frais"
          setStudentsIds={setStudentsIds}
        />
      </SimpleForm>
    </Create>
  );
}
