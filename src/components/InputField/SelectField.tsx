import { Box, Autocomplete, TextField, Tooltip } from '@mui/material';

interface SelectFieldProps {
  label: string;
  options: { label: string; value?: string }[];
  value: string | null;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  tooltip?: string;
  getOptionLabel?: (option: { label: string; value?: string }) => string;
  onBlur?: () => void;
}

const SelectField = ({
  label,
  options,
  value,
  onChange,
  error,
  helperText,
  required = false,
  tooltip,
  getOptionLabel,
  onBlur,
}: SelectFieldProps) => {
  // Find the selected option based on value
  const selectedOption = options.find(opt => opt.value === value || opt.label === value) || null;

  const FieldWrapper = tooltip ? (
    <Tooltip title={tooltip} arrow placement="top">
      <Box display="inline-flex" width="100%">
        <Autocomplete
          options={options}
          value={selectedOption}
          onChange={(_, newValue) => onChange(newValue?.value || newValue?.label || '')}
          getOptionLabel={getOptionLabel || ((option) => option.label)}
          onOpen={onBlur}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              error={!!error}
              helperText={error || helperText}
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
      onChange={(_, newValue) => onChange(newValue?.value || newValue?.label || '')}
      getOptionLabel={getOptionLabel || ((option) => option.label)}
      onOpen={onBlur}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={!!error}
          helperText={error || helperText}
          required={required}
          onBlur={onBlur}
        />
      )}
    />
  );

  return FieldWrapper;
};

export default SelectField;

