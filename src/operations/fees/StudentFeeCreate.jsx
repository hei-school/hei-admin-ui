import {useNotify} from "@/hooks";
import {Create} from "@/operations/common/components";
import authProvider from "@/providers/authProvider";
import {SelectInput, SimpleForm, useGetList} from "react-admin";
import {createFeesApi} from "./utils/feeFactory";

export const StudentFeeCreate = ({toggle}) => {
  const notify = useNotify();
  const {id: studentId} = authProvider.getCachedWhoami();
  const {data: feeTemplates = [], isLoading} = useGetList(
    "fees-templates",
    {},
    {
      select: ({data: templates}) => ({
        data: templates.filter((template) => template.type === "TUITION"),
      }),
    }
  );
  const getSelectedTemplate = (templateId) => {
    return feeTemplates.find((template) => template.id === templateId);
  };

  return (
    <Create
      resource="fees"
      title=" "
      redirect={false}
      mutationOptions={{
        onSuccess: () => {
          notify("Frais créés avec succès", {type: "success"});
          toggle();
        },
      }}
      transform={({feesTemplateId}) => {
        const tempalteValue = getSelectedTemplate(feesTemplateId);
        return createFeesApi(
          {
            ...tempalteValue,
            isPredefinedDate: true,
            predefinedMonth: new Date().getMonth(),
            predefinedYear: new Date().getFullYear(),
            comment: tempalteValue.name,
          },
          studentId
        );
      }}
    >
      <SimpleForm>
        <SelectInput
          source="feesTemplateId"
          label="type de frais"
          choices={feeTemplates}
          optionValue="id"
          optionText="name"
          fullWidth
        />
      </SimpleForm>
    </Create>
  );
};
