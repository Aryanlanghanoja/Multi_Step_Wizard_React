import { Box, Autocomplete, TextField, Tooltip } from '@mui/material';

interface SelectFieldProps {
  label: string;
  options: { label: string; value?: string }[];
  value: string | null;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  success?: boolean;
  required?: boolean;
  tooltip?: string;
  getOptionLabel?: (option: { label: string; value?: string }) => string;
  onBlur?: () => void;
  validateOnChange?: boolean;
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
  tooltip,
  getOptionLabel,
  onBlur,
  validateOnChange = false,
  customValidation,
}: SelectFieldProps) => {
  // Find the selected option based on value
  const selectedOption = options.find(opt => opt.value === value || opt.label === value) || null;

  const isSuccess = success && !error;

  // Determine the helper text - priority: error > success > helperText
  const getHelperText = () => {
    if (error) return error;
    if (isSuccess) return 'No error found';
    return helperText;
  };

  // Determine the color based on error/success state
  const getFieldColor = () => {
    if (error) return 'error';
    if (isSuccess) return 'success';
    return undefined;
  };

  const handleChange = (_: React.SyntheticEvent, newValue: { label: string; value?: string } | null) => {
    const selectedValue = newValue?.value || newValue?.label || '';
    onChange(selectedValue);

    // Validate on change if enabled
    if (validateOnChange && onBlur) {
      if (customValidation) {
        customValidation(selectedValue);
      }
      onBlur();
    }
  };

  const FieldWrapper = tooltip ? (
    <Tooltip title={tooltip} arrow placement="top">
      <Box display="inline-flex" width="100%">
        <Autocomplete
          options={options}
          value={selectedOption}
          onChange={handleChange}
          getOptionLabel={getOptionLabel || ((option) => option.label)}
          onOpen={onBlur}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              error={!!error}
              helperText={getHelperText()}
              color={getFieldColor()}
              required={required}
              onBlur={onBlur}
            />
          )}
        />
      </Box>
    </Tooltip>
  ) : (
    <Autocomplete
      options={options}
      value={selectedOption}
      onChange={handleChange}
      getOptionLabel={getOptionLabel || ((option) => option.label)}
      onOpen={onBlur}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={!!error}
          helperText={getHelperText()}
          color={getFieldColor()}
          required={required}
          onBlur={onBlur}
        />
      )}
    />
  );

  return FieldWrapper;
};

export default SelectField;

