import {useNotify} from "@/hooks";
import {FeeInputs} from "@/operations/fees/components";
import {createFeesApi} from "@/operations/fees/utils/feeFactory";
import {Fee} from "@haapi/typescript-client";
import SaveIcon from "@mui/icons-material/Save";
import {useState} from "react";
import {Create, SimpleForm} from "react-admin";
import {StudentListWithBulkActions} from "../common/components";
import {FloatingActionButton} from "../common/components/FloatingActionButton";

interface MultipleStudentFeesCreateProps {}

export default function MultipleStudentFeesCreate(
  props: MultipleStudentFeesCreateProps
) {
  const notify = useNotify();
  const [studentsIds, setStudentsIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (fees: Fee) => {
    setIsSubmitting(true);
    try {
      const transformedFees = studentsIds
        .map((studentId) => createFeesApi(fees, studentId))
        .flat();

      return transformedFees;
    } catch (error) {
      notify("Une erreur s'est produite", {type: "error"});
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

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
      transform={handleSubmit}
    >
      <SimpleForm toolbar={false}>
        <FeeInputs />
        <StudentListWithBulkActions
          title="Ajoutez les étudiants auxquels vous voulez créer des frais"
          setStudentsIds={setStudentsIds}
        />
        <FloatingActionButton
          onClick={() =>
            document
              .querySelector("form")
              ?.dispatchEvent(
                new Event("submit", {cancelable: true, bubbles: true})
              )
          }
          isLoading={isSubmitting}
          disabled={studentsIds.length === 0}
          count={studentsIds.length}
          countLabel={(count) =>
            `étudiant${count > 1 ? "s" : ""} sélectionné${count > 1 ? "s" : ""}`
          }
          actionIcon={<SaveIcon />}
          actionLabel="Créer les frais"
          loadingLabel="Création en cours..."
        />
      </SimpleForm>
    </Create>
  );
}
