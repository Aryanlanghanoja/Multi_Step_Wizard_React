import {
  Box,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Typography,
  Divider,
} from '@mui/material';
import type { EducationInfo, EducationInfoErrors, EducationType } from '../../../types';
import { BOARD_OPTIONS, YEAR_OPTIONS, DEGREE_OPTIONS } from '../../../utils/constants';
import InputField from '../../InputField/InputField';
import SelectField from '../../InputField/SelectField';

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
          <SelectField
            label="Pass Year"
            options={YEAR_OPTIONS.map(opt => ({ label: opt, value: opt }))}
            value={data.tenth.passYear || null}
            onChange={(value) => onChange('tenth', 'passYear', value)}
            error={errors.tenth?.passYear}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SelectField
            label="Board"
            options={BOARD_OPTIONS.map(opt => ({ label: opt, value: opt }))}
            value={data.tenth.board || null}
            onChange={(value) => onChange('tenth', 'board', value)}
            error={errors.tenth?.board}
            required
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
              <SelectField
                label="Pass Year"
                options={YEAR_OPTIONS.map(opt => ({ label: opt, value: opt }))}
                value={data.twelfth.passYear || null}
                onChange={(value) => onChange('twelfth', 'passYear', value)}
                error={errors.twelfth?.passYear}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <SelectField
                label="Board"
                options={BOARD_OPTIONS.map(opt => ({ label: opt, value: opt }))}
                value={data.twelfth.board || null}
                onChange={(value) => onChange('twelfth', 'board', value)}
                error={errors.twelfth?.board}
                required
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
              <SelectField
                label="Passing Year"
                options={YEAR_OPTIONS.map(opt => ({ label: opt, value: opt }))}
                value={data.diploma.passYear || null}
                onChange={(value) => onChange('diploma', 'passYear', value)}
                error={errors.diploma?.passYear}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <InputField
                label="Organization"
                value={data.diploma.organization}
                onChange={(value) => onChange('diploma', 'organization', value)}
                error={errors.diploma?.organization}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <InputField
                label="Major"
                value={data.diploma.major}
                onChange={(value) => onChange('diploma', 'major', value)}
                error={errors.diploma?.major}
                required
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
          <SelectField
            label="Completion Year"
            options={YEAR_OPTIONS.map(opt => ({ label: opt, value: opt }))}
            value={data.graduation.completionYear || null}
            onChange={(value) => onChange('graduation', 'completionYear', value)}
            error={errors.graduation?.completionYear}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <InputField
            label="Organization / University"
            value={data.graduation.organization}
            onChange={(value) => onChange('graduation', 'organization', value)}
            error={errors.graduation?.organization}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SelectField
            label="Degree"
            options={DEGREE_OPTIONS.map(opt => ({ label: opt, value: opt }))}
            value={data.graduation.degree || null}
            onChange={(value) => onChange('graduation', 'degree', value)}
            error={errors.graduation?.degree}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <InputField
            label="Major / Specialization"
            value={data.graduation.major}
            onChange={(value) => onChange('graduation', 'major', value)}
            error={errors.graduation?.major}
            required
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default EducationInfoStep;

