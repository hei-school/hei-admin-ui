import {required, SelectInput, useGetList} from "react-admin";
import {useFormContext} from "react-hook-form";
import {FEE_SELECT_STYLE} from "../utils";

export function SelectPredefinedType(props) {
  const {data = [], isLoading} = useGetList("fees-templates");
  const {reset} = useFormContext();

  const updateFeesFields = (event) => {
    const configId = event.target.value;
    const feeConfig = data.find((el) => el.id === configId);

    reset(
      {
        amount: feeConfig.amount,
        number_of_payments: feeConfig.number_of_payments,
        comment: feeConfig.name,
        type: feeConfig.type,
      },
      {keepDirtyValues: true}
    );
  };

  return (
    <SelectInput
      name="predefinedType"
      data-testid="predefinedType"
      source="predefinedType"
      label="Type prédéfini"
      optionValue="id"
      optionText="name"
      choices={data}
      isLoading={isLoading}
      onChange={updateFeesFields}
      validate={required()}
      sx={FEE_SELECT_STYLE}
      {...props}
    />
  );
}
