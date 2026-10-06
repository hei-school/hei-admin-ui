import {FilledTextFieldProps, TextField} from "@mui/material";
import {indigo} from "@mui/material/colors";
import {Button, ButtonProps} from "react-admin";

export type CustomTextFieldProps = Omit<FilledTextFieldProps, "variant"> & {
  validator?: boolean;
};

export const CustomTextField = (props: Readonly<CustomTextFieldProps>) => {
  const {placeholder, onChange, type, label, validator, ...rest} = props;
  return (
    <TextField
      {...rest}
      required
      error={validator}
      helperText={validator && "Ce champs est requis"}
      label={label}
      variant="filled"
      placeholder={placeholder}
      type={type}
      onChange={onChange}
      style={{
        margin: "0.75vw",
        width: "300px",
      }}
    />
  );
};

export type CustomSubmitButtonProps = {
  text: string;
  onClick: ButtonProps["onClick"];
};

export const CustomSubmitButton = ({
  text,
  onClick,
}: Readonly<CustomSubmitButtonProps>) => {
  return (
    <Button
      onClick={onClick}
      style={{
        backgroundColor: indigo[800],
        width: "300px",
        color: "#FFFF",
        padding: "0.5vw",
        margin: "0.75vw",
      }}
    >
      <>{text}</>
    </Button>
  );
};
