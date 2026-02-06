import {
  Box,
  Grid,
  TextField,
  Autocomplete,
  Tooltip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { PersonalInfo, PersonalInfoErrors, CountryCode } from '../../../types';
import { COUNTRY_CODES } from '../../../utils/constants';

dayjs.extend(customParseFormat);

interface PersonalInfoStepProps {
  data: PersonalInfo;
  errors: PersonalInfoErrors;
  onChange: (field: keyof PersonalInfo, value: string) => void;
  onBlur: (field: keyof PersonalInfo) => void;
}

// Utility function to parse date in either YYYY-MM-DD or DD/MM/YYYY format
const parseDate = (dateString: string): Dayjs | undefined => {
  if (!dateString) return undefined;
  // Try DD/MM/YYYY first (new format)
  if (dayjs(dateString, 'DD/MM/YYYY', true).isValid()) {
    return dayjs(dateString, 'DD/MM/YYYY');
  }
  // Fall back to YYYY-MM-DD (old format for existing data)
  if (dayjs(dateString, 'YYYY-MM-DD', true).isValid()) {
    return dayjs(dateString, 'YYYY-MM-DD');
  }
  // Try default parsing
  return dayjs(dateString);
};

const PersonalInfoStep = ({ data, errors, onChange, onBlur }: PersonalInfoStepProps) => {
  const selectedCountry = COUNTRY_CODES.find((c) => c.phone === data.countryCode) || null;

  const handleDateChange = (date: Dayjs | null) => {
    onChange('dateOfBirth', date ? date.format('DD/MM/YYYY') : '');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          {/* First Name */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Tooltip title="Enter your first name (alphabets only)" arrow placement="top">
              <TextField
                fullWidth
                label="First Name"
                required
                value={data.firstName}
                onChange={(e) => onChange('firstName', e.target.value)}
                onBlur={() => onBlur('firstName')}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Tooltip>
          </Grid>

          {/* Middle Name */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Tooltip title="Enter your middle name (optional)" arrow placement="top">
              <TextField
                fullWidth
                label="Middle Name"
                value={data.middleName}
                onChange={(e) => onChange('middleName', e.target.value)}
                onBlur={() => onBlur('middleName')}
                error={!!errors.middleName}
                helperText={errors.middleName}
              />
            </Tooltip>
          </Grid>

          {/* Last Name */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Tooltip title="Enter your last name (alphabets only)" arrow placement="top">
              <TextField
                fullWidth
                label="Last Name"
                required
                value={data.lastName}
                onChange={(e) => onChange('lastName', e.target.value)}
                onBlur={() => onBlur('lastName')}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Tooltip>
          </Grid>

          {/* Country Code */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Autocomplete
              options={COUNTRY_CODES}
              getOptionLabel={(option: CountryCode) => `${option.label} (${option.phone})`}
              value={selectedCountry}
              onChange={(_, newValue) => {
                onChange('countryCode', newValue?.phone || '');
              }}
              onOpen={() => {
                // Validate country code when autocomplete is opened
                if (!data.countryCode) {
                  onBlur('countryCode');
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Country Code"
                  required
                  error={!!errors.countryCode}
                  helperText={errors.countryCode}
                  onBlur={() => onBlur('countryCode')}
                />
              )}
            />
          </Grid>

          {/* Phone Number */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Tooltip title="Enter phone number (digits only, 7-15 characters)" arrow placement="top">
              <TextField
                fullWidth
                label="Phone Number"
                required
                value={data.phoneNumber}
                onChange={(e) => onChange('phoneNumber', e.target.value)}
                onBlur={() => onBlur('phoneNumber')}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
                slotProps={{
                  input: {
                    startAdornment: data.countryCode ? (
                      <Box sx={{ mr: 1, color: 'text.secondary' }}>{data.countryCode}</Box>
                    ) : null,
                  },
                }}
              />
            </Tooltip>
          </Grid>

          {/* Email */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Tooltip title="Enter a valid email address" arrow placement="top">
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                required
                value={data.email}
                onChange={(e) => onChange('email', e.target.value)}
                onBlur={() => onBlur('email')}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Tooltip>
          </Grid>

          {/* Date of Birth */}
          <Grid size={{ xs: 12, md: 6 }}>
            <DatePicker
              label="Date of Birth *"
              value={parseDate(data.dateOfBirth)}
              onChange={handleDateChange}
              maxDate={dayjs()}
              format="DD/MM/YYYY"
              onClose={() => onBlur('dateOfBirth')}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.dateOfBirth,
                  helperText: errors.dateOfBirth,
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default PersonalInfoStep;
