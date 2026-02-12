import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material/TextField";

interface InputFieldProps extends Omit<
  TextFieldProps,
  "error" | "helperText" | "onChange" | "onBlur"
> {
  label: string;
  value: string;
  error?: string;
  helperText?: string;
  success?: boolean;
  required?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  validationPattern?: RegExp;
  customValidation?: (value: string) => string | undefined;
  immediateValidation?: (value: string) => string | undefined;
}

const InputField = ({
  label,
  value,
  error,
  helperText,
  success = false,
  required = false,
  onChange,
  onBlur,
  validationPattern,
  customValidation,
  immediateValidation,
  type = "text",
  ...props
}: InputFieldProps) => {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (onChange) {
      onChange(newValue);
    }
  };

  const handleBlur = () => {
    if (immediateValidation) {
      immediateValidation(value);
    } else {
      let validationError: string | undefined;

      if (validationPattern && !validationPattern.test(value)) {
        validationError = `Invalid ${label.toLowerCase()} format`;
      } else if (customValidation) {
        validationError = customValidation(value);
      }

      if (validationError || (!required && value === "")) {
        // Validation error, but since we're on blur, just call onBlur if provided
      }
    }

    if (onBlur) onBlur();
  };

  const isSuccess = success && !error;

  const getHelperText = () => {
    if (error) return error;
    return helperText;
  };

  const getFieldColor = () => {
    if (error) return "error";
    if (isSuccess) return "success";
    return undefined;
  };

  return (
    <TextField
      fullWidth
      label={label}
      value={value}
      onChange={handleInput}
      onBlur={handleBlur}
      error={!!error}
      helperText={getHelperText()}
      color={getFieldColor()}
      required={required}
      type={type}
      {...props}
    />
  );
};

export default InputField;
