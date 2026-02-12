import { Autocomplete, TextField } from "@mui/material";

interface SelectFieldProps {
  label: string;
  options: { label: string; value?: string }[];
  value: string | null;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  success?: boolean;
  required?: boolean;
  getOptionLabel?: (option: { label: string; value?: string }) => string;
  onBlur?: () => void;
  customValidation?: (value: string) => string | undefined;
}

const SelectField = ({
  label,
  options,
  value,
  onChange,
  error,
  helperText,
  success = false,
  required = false,
  getOptionLabel,
  onBlur,
  customValidation,
}: SelectFieldProps) => {
  const selectedOption =
    options.find((opt) => opt.value === value || opt.label === value) || null;

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

  const handleChange = (
    _: React.SyntheticEvent,
    newValue: { label: string; value?: string } | null,
  ) => {
    const selectedValue = newValue?.value || newValue?.label || "";
    onChange(selectedValue);
  };

  const handleBlur = () => {
    if (customValidation) {
      customValidation(value || "");
    }
    if (onBlur) onBlur();
  };

  return (
    <Autocomplete
      options={options}
      value={selectedOption}
      onChange={handleChange}
      getOptionLabel={getOptionLabel || ((option) => option.label)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={!!error}
          helperText={getHelperText()}
          color={getFieldColor()}
          required={required}
          onBlur={handleBlur}
        />
      )}
    />
  );
};

export default SelectField;
