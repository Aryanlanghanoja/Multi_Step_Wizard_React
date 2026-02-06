import {
  Box,
  Grid,
  TextField,
  Autocomplete,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Typography,
  Divider,
} from '@mui/material';
import type { EducationInfo, EducationInfoErrors, EducationType, BoardType } from '../../../types';
import { BOARD_OPTIONS, YEAR_OPTIONS, DEGREE_OPTIONS } from '../../../utils/constants';

interface EducationInfoStepProps {
  data: EducationInfo;
  errors: EducationInfoErrors;
  onChange: (section: string, field: string, value: string) => void;
  onEducationTypeChange: (type: EducationType) => void;
}

const EducationInfoStep = ({
  data,
  errors,
  onChange,
  onEducationTypeChange,
}: EducationInfoStepProps) => {
  return (
    <Box sx={{ mt: 2 }}>
      {/* 10th Details */}
      <Typography variant="h6" gutterBottom>
        10th Standard Details
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Autocomplete
            options={YEAR_OPTIONS}
            value={data.tenth.passYear || null}
            onChange={(_, newValue) => onChange('tenth', 'passYear', newValue || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Pass Year"
                required
                error={!!errors.tenth?.passYear}
                helperText={errors.tenth?.passYear}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Autocomplete
            options={BOARD_OPTIONS}
            value={data.tenth.board || null}
            onChange={(_, newValue) => onChange('tenth', 'board', (newValue as BoardType) || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Board"
                required
                error={!!errors.tenth?.board}
                helperText={errors.tenth?.board}
              />
            )}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Education Type Selection */}
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormLabel component="legend">Education Type After 10th</FormLabel>
        <RadioGroup
          row
          value={data.educationType}
          onChange={(e) => onEducationTypeChange(e.target.value as EducationType)}
        >
          <FormControlLabel value="12th" control={<Radio />} label="12th Standard" />
          <FormControlLabel value="diploma" control={<Radio />} label="Diploma" />
        </RadioGroup>
      </FormControl>

      {/* 12th Details - Conditional */}
      {data.educationType === '12th' && (
        <>
          <Typography variant="h6" gutterBottom>
            12th Standard Details
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Autocomplete
                options={YEAR_OPTIONS}
                value={data.twelfth.passYear || null}
                onChange={(_, newValue) => onChange('twelfth', 'passYear', newValue || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Pass Year"
                    required
                    error={!!errors.twelfth?.passYear}
                    helperText={errors.twelfth?.passYear}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Autocomplete
                options={BOARD_OPTIONS}
                value={data.twelfth.board || null}
                onChange={(_, newValue) => onChange('twelfth', 'board', (newValue as BoardType) || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Board"
                    required
                    error={!!errors.twelfth?.board}
                    helperText={errors.twelfth?.board}
                  />
                )}
              />
            </Grid>
          </Grid>
        </>
      )}

      {/* Diploma Details - Conditional */}
      {data.educationType === 'diploma' && (
        <>
          <Typography variant="h6" gutterBottom>
            Diploma Details
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Autocomplete
                options={YEAR_OPTIONS}
                value={data.diploma.passYear || null}
                onChange={(_, newValue) => onChange('diploma', 'passYear', newValue || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Passing Year"
                    required
                    error={!!errors.diploma?.passYear}
                    helperText={errors.diploma?.passYear}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Organization"
                required
                value={data.diploma.organization}
                onChange={(e) => onChange('diploma', 'organization', e.target.value)}
                error={!!errors.diploma?.organization}
                helperText={errors.diploma?.organization}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Major"
                required
                value={data.diploma.major}
                onChange={(e) => onChange('diploma', 'major', e.target.value)}
                error={!!errors.diploma?.major}
                helperText={errors.diploma?.major}
              />
            </Grid>
          </Grid>
        </>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Graduation Details */}
      <Typography variant="h6" gutterBottom>
        Graduation Details
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Autocomplete
            options={YEAR_OPTIONS}
            value={data.graduation.completionYear || null}
            onChange={(_, newValue) => onChange('graduation', 'completionYear', newValue || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Completion Year"
                required
                error={!!errors.graduation?.completionYear}
                helperText={errors.graduation?.completionYear}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Organization / University"
            required
            value={data.graduation.organization}
            onChange={(e) => onChange('graduation', 'organization', e.target.value)}
            error={!!errors.graduation?.organization}
            helperText={errors.graduation?.organization}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Autocomplete
            options={DEGREE_OPTIONS}
            value={data.graduation.degree || null}
            onChange={(_, newValue) => onChange('graduation', 'degree', newValue || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Degree"
                required
                error={!!errors.graduation?.degree}
                helperText={errors.graduation?.degree}
              />
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Major / Specialization"
            required
            value={data.graduation.major}
            onChange={(e) => onChange('graduation', 'major', e.target.value)}
            error={!!errors.graduation?.major}
            helperText={errors.graduation?.major}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default EducationInfoStep;
