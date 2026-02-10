import { Box, Grid, TextField } from '@mui/material';
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

const parseDate = (dateString: string): Dayjs | null => {
  if (!dateString) return null;
  if (dayjs(dateString, 'DD/MM/YYYY', true).isValid()) {
    return dayjs(dateString, 'DD/MM/YYYY');
  }

  if (dayjs(dateString, 'YYYY-MM-DD', true).isValid()) {
    return dayjs(dateString, 'YYYY-MM-DD');
  }

  return dayjs(dateString);
};

interface PersonalInfoStepProps {
  data: PersonalInfo;
  errors: PersonalInfoErrors;
  touched?: Record<string, boolean>;
  onChange: (field: keyof PersonalInfo, value: string) => void;
  onBlur: (field: keyof PersonalInfo) => void;
}

const PersonalInfoStep = ({ data, errors, touched = {}, onChange, onBlur }: PersonalInfoStepProps) => {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validatePhoneNumber = (value: string): string | undefined => {
    if (!value.trim()) return 'Phone number is required';
    if (!/^\d*$/.test(value)) return 'Phone number should contain only digits';
    if (value.length < 7 || value.length > 15) return 'Phone number should be 7-15 digits';
    return undefined;
  };

  const validateEmail = (value: string): string | undefined => {
    if (!value.trim()) return 'Email is required';
    if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address';
    return undefined;
  };

  const validateName = (value: string): string | undefined => {
    if (!value.trim()) return 'This field is required';
    if (!/^[a-zA-Z\s]*$/.test(value)) return 'Should contain only alphabets';
    return undefined;
  };

  const isSuccess = (field: string): boolean => {
    return !!touched[field] && !errors[field as keyof typeof errors];
  };

  const handleDateChange = (date: Dayjs | null) => {
    onChange('dateOfBirth', date ? date.format('DD/MM/YYYY') : '');
    onBlur('dateOfBirth');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <InputField
              label="First Name"
              value={data.firstName}
              onChange={(value) => onChange('firstName', value)}
              onBlur={() => onBlur('firstName')}
              error={errors.firstName}
              success={isSuccess('firstName')}
              required
              tooltip="Enter your first name (alphabets only)"
              validateOnChange
              immediateValidation={validateName}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <InputField
              label="Middle Name"
              value={data.middleName}
              onChange={(value) => onChange('middleName', value)}
              onBlur={() => onBlur('middleName')}
              error={errors.middleName}
              success={isSuccess('middleName')}
              tooltip="Enter your middle name (optional)"
              validateOnChange
              immediateValidation={validateName}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <InputField
              label="Last Name"
              value={data.lastName}
              onChange={(value) => onChange('lastName', value)}
              onBlur={() => onBlur('lastName')}
              error={errors.lastName}
              success={isSuccess('lastName')}
              required 
              tooltip="Enter your last name (alphabets only)"
              validateOnChange
              immediateValidation={validateName}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <SelectField
              label="Country Code"
              options={COUNTRY_CODES.map(cc => ({ label: `${cc.label} (${cc.phone})`, value: cc.phone }))}
              value={data.countryCode}
              onChange={(value) => onChange('countryCode', value)}
              error={errors.countryCode}
              success={isSuccess('countryCode')}
              required
              onBlur={() => onBlur('countryCode')}
              validateOnChange
            />
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <InputField
              label="Phone Number"
              value={data.phoneNumber}
              onChange={(value) => onChange('phoneNumber', value)}
              onBlur={() => onBlur('phoneNumber')}
              error={errors.phoneNumber}
              success={isSuccess('phoneNumber')}
              required
              tooltip="Enter phone number (digits only, 7-15 characters)"
              validateOnChange
              immediateValidation={validatePhoneNumber}
              slotProps={{
                input: {
                  startAdornment: data.countryCode ? (
                    <Box sx={{ mr: 1, color: 'text.secondary' }}>{data.countryCode}</Box>
                  ) : null,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <InputField
              label="Email Address"
              type="email"
              value={data.email}
              onChange={(value) => onChange('email', value)}
              onBlur={() => onBlur('email')}
              error={errors.email}
              success={isSuccess('email')}
              required
              tooltip="Enter a valid email address"
              validateOnChange
              immediateValidation={validateEmail}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <DatePicker
              label="Date of Birth *"
              value={parseDate(data.dateOfBirth)}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
              disableFuture
              maxDate={dayjs().subtract(1, 'day')}
              shouldDisableDate={(date) =>
                date.isSame(dayjs(), 'day') || date.isAfter(dayjs())
              }
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.dateOfBirth,
                  helperText: errors.dateOfBirth,
                  color: isSuccess('dateOfBirth') ? 'success' : undefined,
                  onBlur: () => onBlur('dateOfBirth'),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              required
              label="About"
              multiline
              rows={4}
              value={data.about}
              onChange={(e) => onChange('about', e.target.value)}
              onBlur={() => onBlur('about')}
              error={!!errors.about}
              helperText={errors.about || `${data.about?.length || 0}/500 characters`}
              color={isSuccess('about') ? 'success' : undefined}
              inputProps={{ maxLength: 500 }}
            />
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default PersonalInfoStep;

