import { Box, TextField, Tooltip } from '@mui/material';
import type { TextFieldProps } from '@mui/material/TextField';

interface InputFieldProps extends Omit<TextFieldProps, 'error' | 'helperText' | 'onChange' | 'onBlur'> {
  label: string;
  value: string;
  error?: string;
  helperText?: string;
  success?: boolean;
  required?: boolean;
  tooltip?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  validateOnChange?: boolean;
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
  tooltip,
  onChange,
  onBlur,
  validateOnChange = false,
  validationPattern,
  customValidation,
  immediateValidation,
  type = 'text',
  ...props
}: InputFieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (onChange) {
      onChange(newValue);
    }

    if (immediateValidation && onBlur) {
      immediateValidation(newValue);
      onBlur();
    }
    
    if (validateOnChange && onBlur && !immediateValidation) {
      let validationError: string | undefined;
      
      if (validationPattern && !validationPattern.test(newValue)) {
        validationError = `Invalid ${label.toLowerCase()} format`;
      } else if (customValidation) {
        validationError = customValidation(newValue);
      }
      
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

  const isSuccess = success && !error;

  const getHelperText = () => {
    if (error) return error;
    if (isSuccess) return 'No error found';
    return helperText;
  };

  const getFieldColor = () => {
    if (error) return 'error';
    if (isSuccess) return 'success';
    return undefined;
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
          helperText={getHelperText()}
          color={getFieldColor()}
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
      helperText={getHelperText()}
      color={getFieldColor()}
      required={required}
      type={type}
      {...props}
    />
  );

  return InputWrapper;
};

export default InputField;

