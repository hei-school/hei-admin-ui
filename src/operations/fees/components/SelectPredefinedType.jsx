import {SelectInput, required, useGetList} from "react-admin";
import {useFormContext} from "react-hook-form";
import {FEE_SELECT_STYLE} from "../utils";

// /!\ TODO: all previously declared props could be overwritten by redeclaring them through props
export function SelectPredefinedType(props) {
  const {data: feeTemplates = [], isLoading} = useGetList("fees-templates");
  const {reset, getValues} = useFormContext();

  const updateFeesFields = (event) => {
    const configId = event.target.value;
    const feeConfig = feeTemplates.find((el) => el.id === configId);
    console.log("ito", feeConfig);

    reset({
      ...getValues(),
      predefinedType: feeConfig.id,
      category: feeConfig.category,
      frequency: feeConfig.frequency,
      amount: feeConfig.amount,
      number_of_payments: feeConfig.number_of_payments,
      comment: feeConfig.name,
      type: feeConfig.type,
    });
  };

  return (
    <SelectInput
      name="predefinedType"
      data-testid="predefinedType"
      source="predefinedType"
      label="Type prédéfini"
      optionValue="id"
      optionText="name"
      choices={feeTemplates}
      isLoading={isLoading}
      onChange={updateFeesFields}
      validate={required()}
      sx={FEE_SELECT_STYLE}
      {...props}
    />
  );
}
