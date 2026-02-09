import {
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  Paper,
  Divider,
  Autocomplete,
  TextField,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { WorkExperience, WorkExperienceErrors, JobEntry } from '../../../types';
import { JOB_TYPE_OPTIONS, SKILLS_OPTIONS } from '../../../utils/constants';
import InputField from '../../InputField/InputField';
import SelectField from '../../InputField/SelectField';

dayjs.extend(customParseFormat);

interface WorkExperienceStepProps {
  data: WorkExperience;
  errors: WorkExperienceErrors;
  touched?: {
    totalExperience?: boolean;
    skills?: boolean;
    currentCTC?: boolean;
    expectedCTC?: boolean;
    availableFrom?: boolean;
    jobs?: {
      [jobId: string]: {
        [field: string]: boolean;
      };
    };
  };
  onChange: (field: keyof WorkExperience, value: string) => void;
  onSkillsChange: (skills: string[]) => void;
  onJobChange: (jobId: string, field: keyof JobEntry, value: string) => void;
  onJobBlur: (jobId: string, field: keyof JobEntry) => void;
  onAddJob: () => void;
  onRemoveJob: (jobId: string) => void;
  onBlur: (field: keyof WorkExperience) => void;
}

// Utility function to parse date in either YYYY-MM-DD or DD/MM/YYYY format
const parseDate = (dateString: string): Dayjs | null => {
  if (!dateString) return null;
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

const WorkExperienceStep = ({
  data,
  errors,
  touched = {},
  onChange,
  onSkillsChange,
  onJobChange,
  onJobBlur,
  onAddJob,
  onRemoveJob,
  onBlur,
}: WorkExperienceStepProps) => {
  const handleDateChange = (field: keyof WorkExperience, date: Dayjs | null) => {
    onChange(field, date ? date.format('DD/MM/YYYY') : '');
  };

  const handleJobDateChange = (jobId: string, field: 'startDate' | 'endDate', date: Dayjs | null) => {
    onJobChange(jobId, field, date ? date.format('DD/MM/YYYY') : '');
  };

  // Validation helper functions
  const validateRequired = (value: string): string | undefined => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'This field is required';
    }
    return undefined;
  };

  const validateNumeric = (value: string): string | undefined => {
    if (!value.trim()) return 'This field is required';
    if (!/^\d*\.?\d*$/.test(value)) return 'Should be a number';
    return undefined;
  };

  // Helper to determine if field should show success state
  const isSuccess = (field: string): boolean => {
    if (touched && typeof touched[field as keyof typeof touched] === 'boolean') {
      return !!touched[field as keyof typeof touched] && !(errors as unknown as Record<string, unknown>)?.[field];
    }
    return false;
  };

  // Helper to determine if job field should show success state
  const isJobSuccess = (jobId: string, field: string): boolean => {
    return !!(touched?.jobs?.[jobId]?.[field]) && !(errors.jobs?.[jobId] as unknown as Record<string, unknown>)?.[field];
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ mt: 2 }}>
        {/* Total Experience */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <InputField
              label="Total Experience (Years)"
              value={data.totalExperience}
              onChange={(value) => onChange('totalExperience', value)}
              onBlur={() => onBlur('totalExperience')}
              error={errors.totalExperience}
              success={isSuccess('totalExperience')}
              required
              type="number"
              tooltip="Enter total years of experience"
              validateOnChange
              immediateValidation={validateNumeric}
              slotProps={{ htmlInput: { min: 0 } }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Skills */}
        <Typography variant="h6" gutterBottom>
          Skills
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Autocomplete
              multiple
              freeSolo
              options={SKILLS_OPTIONS}
              value={data.skills}
              onChange={(_, newValue) => onSkillsChange(newValue)}
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Skills"
                  placeholder="Add skills..."
                  helperText="Select from the list or type to add custom skills"
                />
              )}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Job Entries */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Job / Internship Details</Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={onAddJob}
          >
            Add Job
          </Button>
        </Box>

        {data.jobs.map((job, index) => (
          <Paper key={job.id} elevation={2} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Job #{index + 1}
              </Typography>
              {data.jobs.length > 0 && (
                <IconButton
                  color="error"
                  onClick={() => onRemoveJob(job.id)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <DatePicker
                  label="Start Date *"
                  value={parseDate(job.startDate)}
                  onChange={(date) => handleJobDateChange(job.id, 'startDate', date)}
                  format="DD/MM/YYYY"
                  onClose={() => onJobBlur(job.id, 'startDate')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.jobs?.[job.id]?.startDate,
                      helperText: errors.jobs?.[job.id]?.startDate,
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <DatePicker
                  label="End Date *"
                  value={parseDate(job.endDate)}
                  onChange={(date) => handleJobDateChange(job.id, 'endDate', date)}
                  minDate={job.startDate ? parseDate(job.startDate) || undefined : undefined}
                  format="DD/MM/YYYY"
                  onClose={() => onJobBlur(job.id, 'endDate')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.jobs?.[job.id]?.endDate,
                      helperText: errors.jobs?.[job.id]?.endDate,
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <InputField
                  label="Designation"
                  value={job.designation}
                  onChange={(value) => onJobChange(job.id, 'designation', value)}
                  onBlur={() => onJobBlur(job.id, 'designation')}
                  error={errors.jobs?.[job.id]?.designation}
                  success={isJobSuccess(job.id, 'designation')}
                  required
                  validateOnChange
                  immediateValidation={validateRequired}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <SelectField
                  label="Job Type"
                  options={JOB_TYPE_OPTIONS.map(opt => ({ label: opt, value: opt }))}
                  value={job.type || null}
                  onChange={(value) => onJobChange(job.id, 'type', value)}
                  error={errors.jobs?.[job.id]?.type}
                  success={isJobSuccess(job.id, 'type')}
                  required
                  onBlur={() => onJobBlur(job.id, 'type')}
                  validateOnChange
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <InputField
                  label="Description"
                  value={job.description}
                  onChange={(value) => onJobChange(job.id, 'description', value)}
                  onBlur={() => onJobBlur(job.id, 'description')}
                  error={errors.jobs?.[job.id]?.description}
                  success={isJobSuccess(job.id, 'description')}
                  required
                  multiline
                  rows={3}
                  validateOnChange
                  immediateValidation={validateRequired}
                />
              </Grid>
            </Grid>
          </Paper>
        ))}

        {data.jobs.length === 0 && (
          <Paper elevation={1} sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
            <Typography color="text.secondary">
              No job entries added. Click "Add Job" to add your work experience.
            </Typography>
          </Paper>
        )}

        <Divider sx={{ my: 3 }} />

        {/* CTC and Available From */}
        <Typography variant="h6" gutterBottom>
          Compensation & Availability
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <InputField
              label="Current CTC (LPA)"
              value={data.currentCTC}
              onChange={(value) => onChange('currentCTC', value)}
              onBlur={() => onBlur('currentCTC')}
              error={errors.currentCTC}
              success={isSuccess('currentCTC')}
              required
              tooltip="Enter your current CTC in LPA"
              validateOnChange
              immediateValidation={validateNumeric}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <InputField
              label="Expected CTC (LPA)"
              value={data.expectedCTC}
              onChange={(value) => onChange('expectedCTC', value)}
              onBlur={() => onBlur('expectedCTC')}
              error={errors.expectedCTC}
              success={isSuccess('expectedCTC')}
              required
              tooltip="Enter your expected CTC in LPA"
              validateOnChange
              immediateValidation={validateNumeric}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <DatePicker
              label="Available From *"
              value={parseDate(data.availableFrom)}
              onChange={(date) => handleDateChange('availableFrom', date)}
              format="DD/MM/YYYY"
              minDate={dayjs().subtract(1, 'day')}
              onClose={() => onBlur('availableFrom')}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.availableFrom,
                  helperText: errors.availableFrom,
                },
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default WorkExperienceStep;

