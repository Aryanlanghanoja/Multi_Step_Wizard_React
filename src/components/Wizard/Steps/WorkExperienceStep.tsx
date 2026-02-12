import {
  Box,
  Grid,
  Typography,
  Button,
  IconButton,
  Paper,
  Autocomplete,
  TextField,
  Chip,
} from "@mui/material";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import type {
  WorkExperience,
  WorkExperienceErrors,
  JobEntry,
} from "../../../types";
import { JOB_TYPE_OPTIONS, SKILLS_OPTIONS } from "../../../utils/constants";
import InputField from "../../InputField/InputField";
import SelectField from "../../InputField/SelectField";
import DateInput from "../../InputField/DateInput";

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

// const parseDate = (dateString: string): Dayjs | null => {
//   if (!dateString) return null;
//   if (dayjs(dateString, 'DD/MM/YYYY', true).isValid()) {
//     return dayjs(dateString, 'DD/MM/YYYY');
//   }

//   if (dayjs(dateString, 'YYYY-MM-DD', true).isValid()) {
//     return dayjs(dateString, 'YYYY-MM-DD');
//   }

//   return dayjs(dateString);
// };

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
  const validateRequired = (value: string): string | undefined => {
    if (!value || (typeof value === "string" && !value.trim())) {
      return "This field is required";
    }
    return undefined;
  };

  const validateNumeric = (value: string): string | undefined => {
    if (!value.trim()) return "This field is required";
    if (!/^\d*\.?\d*$/.test(value)) return "Should be a number";
    return undefined;
  };

  const isSuccess = (field: string): boolean => {
    if (
      touched &&
      typeof touched[field as keyof typeof touched] === "boolean"
    ) {
      return (
        !!touched[field as keyof typeof touched] &&
        !(errors as unknown as Record<string, unknown>)?.[field]
      );
    }
    return false;
  };

  const isJobSuccess = (jobId: string, field: string): boolean => {
    return (
      !!touched?.jobs?.[jobId]?.[field] &&
      !(errors.jobs?.[jobId] as unknown as Record<string, unknown>)?.[field]
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Experience Overview */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Experience Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <InputField
              label="Total Experience (Years)"
              value={data.totalExperience}
              onChange={(value) => onChange("totalExperience", value)}
              onBlur={() => onBlur("totalExperience")}
              error={errors.totalExperience}
              success={isSuccess("totalExperience")}
              required
              type="number"
              immediateValidation={validateNumeric}
              slotProps={{ htmlInput: { min: 0 } }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Skills */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Skills
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Autocomplete
              multiple
              options={SKILLS_OPTIONS}
              value={data.skills}
              onChange={(_, newValue) => onSkillsChange(newValue)}
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip
                    // key={option}
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Skills"
                  placeholder="Select skills..."
                  helperText="Select skills from the list"
                />
              )}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Job Details */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Job / Internship Details
          </Typography>
          <Button variant="outlined" startIcon={<AddIcon />} onClick={onAddJob}>
            Add Job
          </Button>
        </Box>

        {data.jobs.map((job, index) => (
          <Paper key={job.id} elevation={2} sx={{ p: 2, mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
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
                <DateInput
                  label="Start Date"
                  value={job.startDate}
                  error={errors.jobs?.[job.id]?.startDate}
                  success={isJobSuccess(job.id, "startDate")}
                  required
                  onChange={(value) => onJobChange(job.id, "startDate", value)}
                  onBlur={() => onJobBlur(job.id, "startDate")}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <DateInput
                  label="End Date"
                  value={job.endDate}
                  error={errors.jobs?.[job.id]?.endDate}
                  success={isJobSuccess(job.id, "endDate")}
                  required
                  onChange={(value) => onJobChange(job.id, "endDate", value)}
                  onBlur={() => onJobBlur(job.id, "endDate")}
                  minDate={
                    job.startDate
                      ? dayjs(job.startDate, "DD/MM/YYYY")
                      : undefined
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <InputField
                  label="Designation"
                  value={job.designation}
                  onChange={(value) =>
                    onJobChange(job.id, "designation", value)
                  }
                  onBlur={() => onJobBlur(job.id, "designation")}
                  error={errors.jobs?.[job.id]?.designation}
                  success={isJobSuccess(job.id, "designation")}
                  required
                  immediateValidation={validateRequired}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <SelectField
                  label="Job Type"
                  options={JOB_TYPE_OPTIONS.map((opt) => ({
                    label: opt,
                    value: opt,
                  }))}
                  value={job.type || null}
                  onChange={(value) => onJobChange(job.id, "type", value)}
                  error={errors.jobs?.[job.id]?.type}
                  success={isJobSuccess(job.id, "type")}
                  required
                  onBlur={() => onJobBlur(job.id, "type")}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <InputField
                  label="Company Name"
                  value={job.organization}
                  onChange={(value) =>
                    onJobChange(job.id, "organization", value)
                  }
                  onBlur={() => onJobBlur(job.id, "organization")}
                  error={errors.jobs?.[job.id]?.organization}
                  success={isJobSuccess(job.id, "organization")}
                  required
                  immediateValidation={validateRequired}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <InputField
                  label="Description"
                  value={job.description}
                  onChange={(value) =>
                    onJobChange(job.id, "description", value)
                  }
                  onBlur={() => onJobBlur(job.id, "description")}
                  error={errors.jobs?.[job.id]?.description}
                  success={isJobSuccess(job.id, "description")}
                  required
                  multiline
                  rows={3}
                  immediateValidation={validateRequired}
                />
              </Grid>
            </Grid>
          </Paper>
        ))}

        {data.jobs.length === 0 && (
          <Paper
            elevation={1}
            sx={{ p: 3, textAlign: "center", bgcolor: "grey.50" }}
          >
            <Typography color="text.secondary">
              No job entries added. Click "Add Job" to add your work experience.
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Compensation */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Compensation & Availability
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <InputField
              label="Current CTC (LPA)"
              value={data.currentCTC}
              onChange={(value) => onChange("currentCTC", value)}
              onBlur={() => onBlur("currentCTC")}
              error={errors.currentCTC}
              success={isSuccess("currentCTC")}
              required
              immediateValidation={validateNumeric}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <InputField
              label="Expected CTC (LPA)"
              value={data.expectedCTC}
              onChange={(value) => onChange("expectedCTC", value)}
              onBlur={() => onBlur("expectedCTC")}
              error={errors.expectedCTC}
              success={isSuccess("expectedCTC")}
              required
              immediateValidation={validateNumeric}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <DateInput
              label="Available From"
              value={data.availableFrom}
              error={errors.availableFrom}
              success={isSuccess("availableFrom")}
              required
              onChange={(value) => onChange("availableFrom", value)}
              onBlur={() => onBlur("availableFrom")}
              minDate={dayjs().subtract(1, "day")}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default WorkExperienceStep;
