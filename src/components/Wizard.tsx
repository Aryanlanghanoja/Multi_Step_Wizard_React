import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import type { FormData, FormErrors } from '../types';
import { STEPS } from '../utils/constants';
import { validateForm, validateStep, validatePersonalInfo, validateWorkExperience } from '../utils/validation';
import { createSubmission } from '../services/indexedDB';
import PersonalInfoStep from './steps/PersonalInfoStep';
import EducationInfoStep from './steps/EducationInfoStep';
import WorkExperienceStep from './steps/WorkExperienceStep';
import { createEmptyJob } from '../utils/workExperience';
import styles from './Wizard.module.css';

const initialFormData: FormData = {
  personalInfo: {
    firstName: '',
    middleName: '',
    lastName: '',
    countryCode: '',
    phoneNumber: '',
    email: '',
    dateOfBirth: '',
  },
  educationInfo: {
    tenth: {
      passYear: '',
      board: '',
    },
    educationType: '12th',
    twelfth: {
      passYear: '',
      board: '',
    },
    diploma: {
      passYear: '',
      organization: '',
      major: '',
    },
    graduation: {
      completionYear: '',
      organization: '',
      degree: '',
      major: '',
    },
  },
  workExperience: {
    totalExperience: '',
    jobs: [],
    currentCTC: '',
    expectedCTC: '',
    availableFrom: '',
  },
};

const Wizard = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({
    personalInfo: {},
    educationInfo: {},
    workExperience: {},
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const navigate = useNavigate();

  const handleNext = () => {
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
    const allErrors = validateForm(formData);
    if (Object.keys(allErrors.personalInfo).length > 0 ||
        Object.keys(allErrors.educationInfo).length > 0 ||
        Object.keys(allErrors.workExperience).length > 0) {
      setErrors(allErrors);
      setSnackbar({ open: true, message: 'Please fix all validation errors before submitting.', severity: 'error' });
      return;
    }

    try {
      await createSubmission(formData);
      setSnackbar({ open: true, message: 'Form submitted successfully!', severity: 'success' });
      setTimeout(() => navigate('/data'), 2000);
    } catch (error) {
      console.log(error)
      setSnackbar({ open: true, message: 'Failed to submit form. Please try again.', severity: 'error' });
    }
  };

  const handlePersonalInfoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const handlePersonalInfoBlur = (field: string) => {
    // Re-validate the specific field on blur
    const fieldErrors = validatePersonalInfo(formData.personalInfo);
    // Only update if there's an error for this field
    if (fieldErrors[field as keyof typeof fieldErrors]) {
      setErrors(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [field]: fieldErrors[field as keyof typeof fieldErrors],
        },
      }));
    }
  };

  const handleEducationChange = (section: string, field: string, value: string) => {
    setFormData(prev => {
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
    setFormData(prev => ({
      ...prev,
      educationInfo: {
        ...prev.educationInfo,
        educationType: type as 'diploma' | '12th',
      },
    }));
  };

  const handleWorkExperienceChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      workExperience: {
        ...prev.workExperience,
        [field]: value,
      },
    }));
  };

  const handleWorkExperienceBlur = (field: string) => {
    // Re-validate the specific field on blur
    const fieldErrors = validateWorkExperience(formData.workExperience);
    // Only update if there's an error for this field
    if (fieldErrors[field as keyof typeof fieldErrors]) {
      setErrors(prev => ({
        ...prev,
        workExperience: {
          ...prev.workExperience,
          [field]: fieldErrors[field as keyof typeof fieldErrors],
        },
      }));
    }
  };

  const handleJobChange = (jobId: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      workExperience: {
        ...prev.workExperience,
        jobs: prev.workExperience.jobs.map(job =>
          job.id === jobId ? { ...job, [field]: value } : job
        ),
      },
    }));
  };

  const handleAddJob = () => {
    setFormData(prev => ({
      ...prev,
      workExperience: {
        ...prev.workExperience,
        jobs: [...prev.workExperience.jobs, createEmptyJob()],
      },
    }));
  };

  const handleRemoveJob = (jobId: string) => {
    setFormData(prev => ({
      ...prev,
      workExperience: {
        ...prev.workExperience,
        jobs: prev.workExperience.jobs.filter(job => job.id !== jobId),
      },
    }));
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <PersonalInfoStep
            data={formData.personalInfo}
            errors={errors.personalInfo}
            onChange={handlePersonalInfoChange}
            onBlur={handlePersonalInfoBlur}
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
            onBlur={handleWorkExperienceBlur}
          />
        );
      default:
        return null;
    }
  };

  const isStepValid = () => {
    const stepErrors = validateStep(activeStep, formData);
    return Object.keys(stepErrors).length === 0;
  };

  return (
    <Box className={styles.wizard}>
      <Paper elevation={3} className={styles.wizardContainer}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Multi-Step Wizard Form
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
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!isStepValid()}
          >
            {activeStep === STEPS.length - 1 ? 'Submit' : 'Next'}
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

export default Wizard;
