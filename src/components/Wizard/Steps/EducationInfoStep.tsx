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
} from "@mui/material";
import type {
  EducationInfo,
  EducationInfoErrors,
  EducationType,
} from "../../../types";
import {
  BOARD_OPTIONS,
  DEGREE_OPTIONS,
  generateYearOptions,
} from "../../../utils/constants";
import InputField from "../../InputField/InputField";
import SelectField from "../../InputField/SelectField";

interface EducationInfoStepProps {
  data: EducationInfo;
  errors: EducationInfoErrors;
  touched?: Record<string, Record<string, boolean>>;
  onChange: (section: string, field: string, value: string) => void;
  onBlur: (section: string, field: string) => void;
  onEducationTypeChange: (type: EducationType) => void;
  birthYear?: string;
}

const EducationInfoStep = ({
  data,
  errors,
  touched = {},
  onChange,
  onBlur,
  onEducationTypeChange,
  birthYear,
}: EducationInfoStepProps) => {
  const validateRequired = (value: string): string | undefined => {
    if (!value || (typeof value === "string" && !value.trim())) {
      return "This field is required";
    }
    return undefined;
  };

  const isSuccess = (section: string, field: string): boolean => {
    return (
      !!touched[section]?.[field] &&
      !(errors as Record<string, Record<string, string | undefined>>)?.[
        section
      ]?.[field]
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          10th Standard Details
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <SelectField
              label="Pass Year"
              options={generateYearOptions(birthYear).map((opt) => ({
                label: opt,
                value: opt,
              }))}
              value={data.tenth.passYear || null}
              onChange={(value) => onChange("tenth", "passYear", value)}
              error={errors.tenth?.passYear}
              success={isSuccess("tenth", "passYear")}
              required
              onBlur={() => onBlur("tenth", "passYear")}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SelectField
              label="Board"
              options={BOARD_OPTIONS.map((opt) => ({ label: opt, value: opt }))}
              value={data.tenth.board || null}
              onChange={(value) => onChange("tenth", "board", value)}
              error={errors.tenth?.board}
              success={isSuccess("tenth", "board")}
              required
              onBlur={() => onBlur("tenth", "board")}
            />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 3 }} />

      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormLabel component="legend">Education Type After 10th</FormLabel>
        <RadioGroup
          row
          value={data.educationType}
          onChange={(e) =>
            onEducationTypeChange(e.target.value as EducationType)
          }
        >
          <FormControlLabel
            value="12th"
            control={<Radio />}
            label="12th Standard"
          />
          <FormControlLabel
            value="diploma"
            control={<Radio />}
            label="Diploma"
          />
        </RadioGroup>
      </FormControl>

      {data.educationType === "12th" && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            12th Standard Details
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <SelectField
                label="Pass Year"
                options={generateYearOptions(birthYear).map((opt) => ({
                  label: opt,
                  value: opt,
                }))}
                value={data.twelfth.passYear || null}
                onChange={(value) => onChange("twelfth", "passYear", value)}
                error={errors.twelfth?.passYear}
                success={isSuccess("twelfth", "passYear")}
                required
                onBlur={() => onBlur("twelfth", "passYear")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <SelectField
                label="Board"
                options={BOARD_OPTIONS.map((opt) => ({
                  label: opt,
                  value: opt,
                }))}
                value={data.twelfth.board || null}
                onChange={(value) => onChange("twelfth", "board", value)}
                error={errors.twelfth?.board}
                success={isSuccess("twelfth", "board")}
                required
                onBlur={() => onBlur("twelfth", "board")}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {data.educationType === "Diploma" && (
        <>
          <Typography variant="h6" gutterBottom>
            Diploma Details
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <SelectField
                label="Passing Year"
                options={generateYearOptions(birthYear).map((opt) => ({
                  label: opt,
                  value: opt,
                }))}
                value={data.diploma.passYear || null}
                onChange={(value) => onChange("diploma", "passYear", value)}
                error={errors.diploma?.passYear}
                success={isSuccess("diploma", "passYear")}
                required
                onBlur={() => onBlur("diploma", "passYear")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <InputField
                label="Organization"
                value={data.diploma.organization}
                onChange={(value) => onChange("diploma", "organization", value)}
                error={errors.diploma?.organization}
                success={isSuccess("diploma", "organization")}
                required
                onBlur={() => onBlur("diploma", "organization")}
                immediateValidation={validateRequired}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <InputField
                label="Major"
                value={data.diploma.major}
                onChange={(value) => onChange("diploma", "major", value)}
                error={errors.diploma?.major}
                success={isSuccess("diploma", "major")}
                required
                onBlur={() => onBlur("diploma", "major")}
                immediateValidation={validateRequired}
              />
            </Grid>
          </Grid>
        </>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Graduation Details
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <SelectField
              label="Completion Year"
              options={generateYearOptions(birthYear).map((opt) => ({
                label: opt,
                value: opt,
              }))}
              value={data.graduation.completionYear || null}
              onChange={(value) =>
                onChange("graduation", "completionYear", value)
              }
              error={errors.graduation?.completionYear}
              success={isSuccess("graduation", "completionYear")}
              required
              onBlur={() => onBlur("graduation", "completionYear")}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <InputField
              label="Organization / University"
              value={data.graduation.organization}
              onChange={(value) =>
                onChange("graduation", "organization", value)
              }
              error={errors.graduation?.organization}
              success={isSuccess("graduation", "organization")}
              required
              onBlur={() => onBlur("graduation", "organization")}
              immediateValidation={validateRequired}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SelectField
              label="Degree"
              options={DEGREE_OPTIONS.map((opt) => ({
                label: opt,
                value: opt,
              }))}
              value={data.graduation.degree || null}
              onChange={(value) => onChange("graduation", "degree", value)}
              error={errors.graduation?.degree}
              success={isSuccess("graduation", "degree")}
              required
              onBlur={() => onBlur("graduation", "degree")}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <InputField
              label="Major / Specialization"
              value={data.graduation.major}
              onChange={(value) => onChange("graduation", "major", value)}
              error={errors.graduation?.major}
              success={isSuccess("graduation", "major")}
              required
              onBlur={() => onBlur("graduation", "major")}
              immediateValidation={validateRequired}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default EducationInfoStep;
