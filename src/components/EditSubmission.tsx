import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import type { FormData, FormErrors } from '../types';
import { STEPS } from '../utils/constants';
import { validateForm, validateStep } from '../utils/validation';
import { getSubmissionById, updateSubmission } from '../services/indexedDB';
import PersonalInfoStep from './steps/PersonalInfoStep';
import EducationInfoStep from './steps/EducationInfoStep';
import WorkExperienceStep from './steps/WorkExperienceStep';
import { createEmptyJob } from '../utils/workExperience';
import styles from './EditSubmission.module.css';

const EditSubmission = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [errors, setErrors] = useState<FormErrors>({
    personalInfo: {},
    educationInfo: {},
    workExperience: {},
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });

  useEffect(() => {
    const loadSubmission = async () => {
      if (!id) {
        setSnackbar({ open: true, message: 'No submission ID provided', severity: 'error' });
        setLoading(false);
        return;
      }

      try {
        const data = await getSubmissionById(id);
        if (data) {
          setFormData(data);
        } else {
          setSnackbar({ open: true, message: 'Submission not found', severity: 'error' });
          setTimeout(() => navigate('/data'), 2000);
        }
      } catch {
        setSnackbar({ open: true, message: 'Failed to load submission', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    loadSubmission();
  }, [id, navigate]);

  const handleNext = () => {
    if (!formData) return;

    const stepErrors = validateStep(activeStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(prev => ({
        ...prev,
        [STEPS[activeStep].toLowerCase().replace(' ', '')]: stepErrors,
      }));
      return;
    }

    if (activeStep === STEPS.length - 1) {
      handleSubmit();
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!formData || !id) return;

    const allErrors = validateForm(formData);
    if (Object.keys(allErrors.personalInfo).length > 0 ||
        Object.keys(allErrors.educationInfo).length > 0 ||
        Object.keys(allErrors.workExperience).length > 0) {
      setErrors(allErrors);
      setSnackbar({ open: true, message: 'Please fix all validation errors before submitting.', severity: 'error' });
      return;
    }

    setSaving(true);
    try {
      await updateSubmission(formData);
      setSnackbar({ open: true, message: 'Form updated successfully!', severity: 'success' });
      setTimeout(() => navigate('/data'), 2000);
    } catch {
      setSnackbar({ open: true, message: 'Failed to update form. Please try again.', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handlePersonalInfoChange = (field: string, value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [field]: value,
        },
      };
    });
  };

  const handleEducationChange = (section: string, field: string, value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      const updatedEducationInfo = { ...prev.educationInfo };
      if (section === 'tenth') {
        updatedEducationInfo.tenth = { ...updatedEducationInfo.tenth, [field]: value };
      } else if (section === 'twelfth') {
        updatedEducationInfo.twelfth = { ...updatedEducationInfo.twelfth, [field]: value };
      } else if (section === 'diploma') {
        updatedEducationInfo.diploma = { ...updatedEducationInfo.diploma, [field]: value };
      } else if (section === 'graduation') {
        updatedEducationInfo.graduation = { ...updatedEducationInfo.graduation, [field]: value };
      }
      return {
        ...prev,
        educationInfo: updatedEducationInfo,
      };
    });
  };

  const handleEducationTypeChange = (type: string) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        educationInfo: {
          ...prev.educationInfo,
          educationType: type as 'diploma' | '12th',
        },
      };
    });
  };

  const handleWorkExperienceChange = (field: string, value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        workExperience: {
          ...prev.workExperience,
          [field]: value,
        },
      };
    });
  };

  const handleJobChange = (jobId: string, field: string, value: string) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        workExperience: {
          ...prev.workExperience,
          jobs: prev.workExperience.jobs.map(job =>
            job.id === jobId ? { ...job, [field]: value } : job
          ),
        },
      };
    });
  };

  const handleAddJob = () => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        workExperience: {
          ...prev.workExperience,
          jobs: [...prev.workExperience.jobs, createEmptyJob()],
        },
      };
    });
  };

  const handleRemoveJob = (jobId: string) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        workExperience: {
          ...prev.workExperience,
          jobs: prev.workExperience.jobs.filter(job => job.id !== jobId),
        },
      };
    });
  };

  const renderStepContent = (step: number) => {
    if (!formData) return null;

    switch (step) {
      case 0:
        return (
          <PersonalInfoStep
            data={formData.personalInfo}
            errors={errors.personalInfo}
            onChange={handlePersonalInfoChange}
          />
        );
      case 1:
        return (
          <EducationInfoStep
            data={formData.educationInfo}
            errors={errors.educationInfo}
            onChange={handleEducationChange}
            onEducationTypeChange={handleEducationTypeChange}
          />
        );
      case 2:
        return (
          <WorkExperienceStep
            data={formData.workExperience}
            errors={errors.workExperience}
            onChange={handleWorkExperienceChange}
            onJobChange={handleJobChange}
            onAddJob={handleAddJob}
            onRemoveJob={handleRemoveJob}
          />
        );
      default:
        return null;
    }
  };

  const isStepValid = () => {
    if (!formData) return false;
    const stepErrors = validateStep(activeStep, formData);
    return Object.keys(stepErrors).length === 0;
  };

  const handleCancel = () => {
    navigate('/data');
  };

  if (loading) {
    return (
      <Box className={styles.editSubmission}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (!formData) {
    return (
      <Box className={styles.editSubmission}>
        <Paper className={styles.container}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Submission not found
          </Alert>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleCancel}
          >
            Back to List
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box className={styles.editSubmission}>
      <Paper elevation={3} className={styles.container}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Edit Form Submission
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Submission ID: {formData.id}
        </Typography>

        <Stepper activeStep={activeStep} className={styles.stepper}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box className={styles.stepContent}>
          {renderStepContent(activeStep)}
        </Box>

        <Box className={styles.actions}>
          <Button
            disabled={activeStep === 0 || saving}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!isStepValid() || saving}
            startIcon={activeStep === STEPS.length - 1 ? <SaveIcon /> : undefined}
          >
            {saving ? 'Saving...' : activeStep === STEPS.length - 1 ? 'Save Changes' : 'Next'}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditSubmission;
