import {
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  Paper,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { WorkExperience, WorkExperienceErrors, JobEntry } from '../../../types';
import { JOB_TYPE_OPTIONS } from '../../../utils/constants';
import InputField from '../../InputField/InputField';
import SelectField from '../../InputField/SelectField';

dayjs.extend(customParseFormat);

interface WorkExperienceStepProps {
  data: WorkExperience;
  errors: WorkExperienceErrors;
  onChange: (field: keyof WorkExperience, value: string) => void;
  onJobChange: (jobId: string, field: keyof JobEntry, value: string) => void;
  onAddJob: () => void;
  onRemoveJob: (jobId: string) => void;
  onBlur: (field: keyof WorkExperience) => void;
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

const WorkExperienceStep = ({
  data,
  errors,
  onChange,
  onJobChange,
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

  // Validation pattern for numeric values
  const numericOnlyPattern = /^\d*\.?\d*$/;

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
              required
              type="number"
              tooltip="Enter total years of experience"
              validateOnChange
              validationPattern={numericOnlyPattern}
              slotProps={{ htmlInput: { min: 0 } }}
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
                  onClose={() => onBlur('jobs')}
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
                  minDate={job.startDate ? parseDate(job.startDate) : undefined}
                  format="DD/MM/YYYY"
                  onClose={() => onBlur('jobs')}
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
                  onBlur={() => onBlur('jobs')}
                  error={errors.jobs?.[job.id]?.designation}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <SelectField
                  label="Job Type"
                  options={JOB_TYPE_OPTIONS.map(opt => ({ label: opt, value: opt }))}
                  value={job.type || null}
                  onChange={(value) => onJobChange(job.id, 'type', value)}
                  error={errors.jobs?.[job.id]?.type}
                  required
                  onBlur={() => onBlur('jobs')}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <InputField
                  label="Description"
                  value={job.description}
                  onChange={(value) => onJobChange(job.id, 'description', value)}
                  onBlur={() => onBlur('jobs')}
                  error={errors.jobs?.[job.id]?.description}
                  required
                  multiline
                  rows={3}
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
              required
              tooltip="Enter your current CTC in LPA"
              validateOnChange
              validationPattern={numericOnlyPattern}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <InputField
              label="Expected CTC (LPA)"
              value={data.expectedCTC}
              onChange={(value) => onChange('expectedCTC', value)}
              onBlur={() => onBlur('expectedCTC')}
              error={errors.expectedCTC}
              required
              tooltip="Enter your expected CTC in LPA"
              validateOnChange
              validationPattern={numericOnlyPattern}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <DatePicker
              label="Available From *"
              value={parseDate(data.availableFrom)}
              onChange={(date) => handleDateChange('availableFrom', date)}
              format="DD/MM/YYYY"
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

