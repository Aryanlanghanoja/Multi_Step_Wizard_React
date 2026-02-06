import {
  Box,
  Grid,
  TextField,
  Autocomplete,
  Typography,
  Button,
  IconButton,
  Paper,
  Divider,
  Tooltip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { WorkExperience, WorkExperienceErrors, JobEntry, JobType } from '../../types';
import { JOB_TYPE_OPTIONS } from '../../utils/constants';
import { generateId } from '../../services/indexedDB';

interface WorkExperienceStepProps {
  data: WorkExperience;
  errors: WorkExperienceErrors;
  onChange: (field: keyof WorkExperience, value: string) => void;
  onJobChange: (jobId: string, field: keyof JobEntry, value: string) => void;
  onAddJob: () => void;
  onRemoveJob: (jobId: string) => void;
}

const WorkExperienceStep = ({
  data,
  errors,
  onChange,
  onJobChange,
  onAddJob,
  onRemoveJob,
}: WorkExperienceStepProps) => {
  const handleDateChange = (field: keyof WorkExperience, date: Dayjs | null) => {
    onChange(field, date ? date.format('DD/MM/YYYY') : '');
  };

  const handleJobDateChange = (jobId: string, field: 'startDate' | 'endDate', date: Dayjs | null) => {
    onJobChange(jobId, field, date ? date.format('DD/MM/YYYY') : '');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ mt: 2 }}>
        {/* Total Experience */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Tooltip title="Enter total years of experience" arrow placement="top">
              <TextField
                fullWidth
                label="Total Experience (Years)"
                required
                type="number"
                value={data.totalExperience}
                onChange={(e) => onChange('totalExperience', e.target.value)}
                error={!!errors.totalExperience}
                helperText={errors.totalExperience}
                slotProps={{ htmlInput: { min: 0 } }}
              />
            </Tooltip>
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
                  value={job.startDate ? dayjs(job.startDate, 'DD/MM/YYYY') : null}
                  onChange={(date) => handleJobDateChange(job.id, 'startDate', date)}
                  format="DD/MM/YYYY"
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
                  value={job.endDate ? dayjs(job.endDate, 'DD/MM/YYYY') : null}
                  onChange={(date) => handleJobDateChange(job.id, 'endDate', date)}
                  minDate={job.startDate ? dayjs(job.startDate, 'DD/MM/YYYY') : undefined}
                  format="DD/MM/YYYY"
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
                <TextField
                  fullWidth
                  label="Designation"
                  required
                  value={job.designation}
                  onChange={(e) => onJobChange(job.id, 'designation', e.target.value)}
                  error={!!errors.jobs?.[job.id]?.designation}
                  helperText={errors.jobs?.[job.id]?.designation}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Autocomplete
                  options={JOB_TYPE_OPTIONS}
                  value={job.type || null}
                  onChange={(_, newValue) => onJobChange(job.id, 'type', (newValue as JobType) || '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Job Type"
                      required
                      error={!!errors.jobs?.[job.id]?.type}
                      helperText={errors.jobs?.[job.id]?.type}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  required
                  value={job.description}
                  onChange={(e) => onJobChange(job.id, 'description', e.target.value)}
                  error={!!errors.jobs?.[job.id]?.description}
                  helperText={errors.jobs?.[job.id]?.description}
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
            <Tooltip title="Enter your current CTC in LPA" arrow placement="top">
              <TextField
                fullWidth
                label="Current CTC (LPA)"
                required
                value={data.currentCTC}
                onChange={(e) => onChange('currentCTC', e.target.value)}
                error={!!errors.currentCTC}
                helperText={errors.currentCTC}
              />
            </Tooltip>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Tooltip title="Enter your expected CTC in LPA" arrow placement="top">
              <TextField
                fullWidth
                label="Expected CTC (LPA)"
                required
                value={data.expectedCTC}
                onChange={(e) => onChange('expectedCTC', e.target.value)}
                error={!!errors.expectedCTC}
                helperText={errors.expectedCTC}
              />
            </Tooltip>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <DatePicker
              label="Available From *"
              value={data.availableFrom ? dayjs(data.availableFrom, 'DD/MM/YYYY') : null}
              onChange={(date) => handleDateChange('availableFrom', date)}
              format="DD/MM/YYYY"
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

export const createEmptyJob = (): JobEntry => ({
  id: generateId(),
  startDate: '',
  endDate: '',
  designation: '',
  type: '',
  description: '',
});
