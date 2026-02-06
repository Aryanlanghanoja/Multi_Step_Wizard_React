import { Box, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { PersonalInfo, PersonalInfoErrors } from '../../../types';
import { COUNTRY_CODES } from '../../../utils/constants';
import InputField from '../../InputField/InputField';
import SelectField from '../../InputField/SelectField';

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
  // Validation patterns
  const alphaOnlyPattern = /^[a-zA-Z\s]*$/;
  const numericOnlyPattern = /^\d*$/;

  const handleDateChange = (date: Dayjs | null) => {
    onChange('dateOfBirth', date ? date.format('DD/MM/YYYY') : '');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          {/* First Name */}
          <Grid size={{ xs: 12, md: 4 }}>
            <InputField
              label="First Name"
              value={data.firstName}
              onChange={(value) => onChange('firstName', value)}
              onBlur={() => onBlur('firstName')}
              error={errors.firstName}
              required
              tooltip="Enter your first name (alphabets only)"
              validateOnChange
              validationPattern={alphaOnlyPattern}
            />
          </Grid>

          {/* Middle Name */}
          <Grid size={{ xs: 12, md: 4 }}>
            <InputField
              label="Middle Name"
              value={data.middleName}
              onChange={(value) => onChange('middleName', value)}
              onBlur={() => onBlur('middleName')}
              error={errors.middleName}
              tooltip="Enter your middle name (optional)"
              validateOnChange
              validationPattern={alphaOnlyPattern}
            />
          </Grid>

          {/* Last Name */}
          <Grid size={{ xs: 12, md: 4 }}>
            <InputField
              label="Last Name"
              value={data.lastName}
              onChange={(value) => onChange('lastName', value)}
              onBlur={() => onBlur('lastName')}
              error={errors.lastName}
              required
              tooltip="Enter your last name (alphabets only)"
              validateOnChange
              validationPattern={alphaOnlyPattern}
            />
          </Grid>

          {/* Country Code */}
          <Grid size={{ xs: 12, md: 4 }}>
            <SelectField
              label="Country Code"
              options={COUNTRY_CODES.map(cc => ({ label: `${cc.label} (${cc.phone})`, value: cc.phone }))}
              value={data.countryCode}
              onChange={(value) => onChange('countryCode', value)}
              error={errors.countryCode}
              required
              onBlur={() => onBlur('countryCode')}
            />
          </Grid>

          {/* Phone Number */}
          <Grid size={{ xs: 12, md: 8 }}>
            <InputField
              label="Phone Number"
              value={data.phoneNumber}
              onChange={(value) => onChange('phoneNumber', value)}
              onBlur={() => onBlur('phoneNumber')}
              error={errors.phoneNumber}
              required
              tooltip="Enter phone number (digits only, 7-15 characters)"
              validateOnChange
              validationPattern={numericOnlyPattern}
              slotProps={{
                input: {
                  startAdornment: data.countryCode ? (
                    <Box sx={{ mr: 1, color: 'text.secondary' }}>{data.countryCode}</Box>
                  ) : null,
                },
              }}
            />
          </Grid>

          {/* Email */}
          <Grid size={{ xs: 12, md: 6 }}>
            <InputField
              label="Email Address"
              type="email"
              value={data.email}
              onChange={(value) => onChange('email', value)}
              onBlur={() => onBlur('email')}
              error={errors.email}
              required
              tooltip="Enter a valid email address"
              validateOnChange
            />
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

