import { useEffect } from "react";
import { Create, SimpleForm } from "react-admin";
import { useNotify, useStudentRef } from "../../hooks";
import { FeeFields } from "./components";
import {createFeesApi} from "./utils";

export default function FeeCreate(props){
  const notify = useNotify()
  const {studentId, studentRef, fetchRef} = useStudentRef("studentId");

  useEffect(() => {
    fetchRef();
  }, [studentRef]);

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
      transform={feesRecord => createFeesApi(feesRecord, studentId)}
    >
      <SimpleForm>
        <FeeFields />
      </SimpleForm>
    </Create>
  )
}
