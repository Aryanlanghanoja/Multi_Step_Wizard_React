import { Box, TextField, Tooltip } from '@mui/material';
import type { TextFieldProps } from '@mui/material/TextField';

interface InputFieldProps extends Omit<TextFieldProps, 'error' | 'helperText' | 'onChange' | 'onBlur'> {
  label: string;
  value: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  tooltip?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  validateOnChange?: boolean;
  validationPattern?: RegExp;
  customValidation?: (value: string) => string | undefined;
}

const InputField = ({
  label,
  value,
  error,
  helperText,
  required = false,
  tooltip,
  onChange,
  onBlur,
  validateOnChange = false,
  validationPattern,
  customValidation,
  type = 'text',
  ...props
}: InputFieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (onChange) {
      onChange(newValue);
    }

    // Validate on change if enabled
    if (validateOnChange && onBlur) {
      let validationError: string | undefined;
      
      if (validationPattern && !validationPattern.test(newValue)) {
        validationError = `Invalid ${label.toLowerCase()} format`;
      } else if (customValidation) {
        validationError = customValidation(newValue);
      }
      
      // Only call onBlur if there's an error to clear/set it
      if (validationError || (!required && newValue === '')) {
        onBlur();
      }
    }
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur();
    }
  };

  const InputWrapper = tooltip ? (
    <Tooltip title={tooltip} arrow placement="top">
      <Box display="inline-flex" width="100%">
        <TextField
          fullWidth
          label={label}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!error}
          helperText={error || helperText}
          required={required}
          type={type}
          {...props}
        />
      </Box>
    </Tooltip>
  ) : (
    <TextField
      fullWidth
      label={label}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={!!error}
      helperText={error || helperText}
      required={required}
      type={type}
      {...props}
    />
  );

  return InputWrapper;
};

export default InputField;

