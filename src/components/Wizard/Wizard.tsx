import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import dayjs from "dayjs";
import type { FormData, FormErrors } from "../../types";
import { STEPS } from "../../utils/constants";
import {
  validateForm,
  validateStep,
  validatePersonalInfo,
  validateWorkExperience,
  validateEducationInfo,
} from "../../utils/validation";
import { createSubmission } from "../../services/indexedDB";
import PersonalInfoStep from "./Steps/PersonalInfoStep";
import EducationInfoStep from "./Steps/EducationInfoStep";
import WorkExperienceStep from "./Steps/WorkExperienceStep";
import { createEmptyJob } from "../../utils/workExperience";
import styles from "./Wizard.module.css";

const initialFormData: FormData = {
  personalInfo: {
    firstName: "",
    middleName: "",
    lastName: "",
    countryCode: "",
    phoneNumber: "",
    email: "",
    dateOfBirth: "",
    about: "",
  },
  educationInfo: {
    tenth: {
      passYear: "",
      board: "",
    },
    educationType: "12th",
    twelfth: {
      passYear: "",
      board: "",
    },
    diploma: {
      passYear: "",
      organization: "",
      major: "",
    },
    graduation: {
      completionYear: "",
      organization: "",
      degree: "",
      major: "",
    },
  },
  workExperience: {
    totalExperience: "",
    jobs: [],
    skills: [],
    currentCTC: "",
    expectedCTC: "",
    availableFrom: "",
  },
};

interface TouchedPersonalInfo {
  [key: string]: boolean;
}

interface TouchedEducationInfo {
  [section: string]: {
    [field: string]: boolean;
  };
}

interface TouchedJobs {
  [jobId: string]: {
    [field: string]: boolean;
  };
}

interface TouchedWorkExperience {
  totalExperience?: boolean;
  skills?: boolean;
  currentCTC?: boolean;
  expectedCTC?: boolean;
  availableFrom?: boolean;
  jobs?: TouchedJobs;
}

interface TouchedState {
  personalInfo: TouchedPersonalInfo;
  educationInfo: TouchedEducationInfo;
  workExperience: TouchedWorkExperience;
}

const initialTouchedState: TouchedState = {
  personalInfo: {},
  educationInfo: {
    tenth: {},
    twelfth: {},
    diploma: {},
    graduation: {},
  },
  workExperience: {
    jobs: {},
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
  const [touched, setTouched] = useState<TouchedState>(initialTouchedState);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const navigate = useNavigate();

  const handleNext = () => {
    const stepErrors = validateStep(activeStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors((prev) => ({
        ...prev,
        [STEPS[activeStep].toLowerCase().replace(" ", "")]: stepErrors,
      }));
      return;
    }

    if (activeStep === STEPS.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    const allErrors = validateForm(formData);
    if (
      Object.keys(allErrors.personalInfo).length > 0 ||
      Object.keys(allErrors.educationInfo).length > 0 ||
      Object.keys(allErrors.workExperience).length > 0
    ) {
      setErrors(allErrors);
      setSnackbar({
        open: true,
        message: "Please fix all validation errors before submitting.",
        severity: "error",
      });
      return;
    }

    try {
      await createSubmission(formData);
      console.log(formData);
      setSnackbar({
        open: true,
        message: "Form submitted successfully!",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/data");
      }, 500);
    } catch (error) {
      console.log(error);
      setSnackbar({
        open: true,
        message: "Failed to submit form. Please try again.",
        severity: "error",
      });
    }
  };

  const handlePersonalInfoChange = (field: string, value: string) => {
    const updatedPersonalInfo = {
      ...formData.personalInfo,
      [field]: value,
    };
    const fieldErrors = validatePersonalInfo(updatedPersonalInfo);

    setFormData((prev) => ({
      ...prev,
      personalInfo: updatedPersonalInfo,
    }));

    setErrors((prev) => {
      const newPersonalInfoErrors = { ...prev.personalInfo };
      const error = fieldErrors[field as keyof typeof fieldErrors];
      if (error) {
        newPersonalInfoErrors[field as keyof typeof newPersonalInfoErrors] =
          error;
      } else {
        delete newPersonalInfoErrors[
          field as keyof typeof newPersonalInfoErrors
        ];
      }
      return {
        ...prev,
        personalInfo: newPersonalInfoErrors,
      };
    });
  };

  const handlePersonalInfoBlur = (field: string) => {
    setTouched((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: true,
      },
    }));

    const fieldErrors = validatePersonalInfo(formData.personalInfo);
    setErrors((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: fieldErrors[field as keyof typeof fieldErrors],
      },
    }));
  };

  const handleEducationChange = (
    section: string,
    field: string,
    value: string,
  ) => {
    setFormData((prev) => {
      const updatedEducationInfo = { ...prev.educationInfo };
      if (section === "tenth") {
        updatedEducationInfo.tenth = {
          ...updatedEducationInfo.tenth,
          [field]: value,
        };
      } else if (section === "twelfth") {
        updatedEducationInfo.twelfth = {
          ...updatedEducationInfo.twelfth,
          [field]: value,
        };
      } else if (section === "diploma") {
        updatedEducationInfo.diploma = {
          ...updatedEducationInfo.diploma,
          [field]: value,
        };
      } else if (section === "graduation") {
        updatedEducationInfo.graduation = {
          ...updatedEducationInfo.graduation,
          [field]: value,
        };
      }
      return {
        ...prev,
        educationInfo: updatedEducationInfo,
      };
    });

    const fieldErrors = validateEducationInfo(formData.educationInfo);
    const sectionFieldError = (
      fieldErrors as Record<string, Record<string, string | undefined>>
    )?.[section]?.[field];

    if (sectionFieldError) {
      setErrors((prev) => ({
        ...prev,
        educationInfo: {
          ...prev.educationInfo,
          [section]: {
            ...(
              prev.educationInfo as Record<
                string,
                Record<string, string | undefined>
              >
            )?.[section],
            [field]: sectionFieldError,
          },
        },
      }));
    }
  };

  const handleEducationBlur = (section: string, field: string) => {
    setTouched((prev) => ({
      ...prev,
      educationInfo: {
        ...prev.educationInfo,
        [section]: {
          ...prev.educationInfo[section],
          [field]: true,
        },
      },
    }));

    const fieldErrors = validateEducationInfo(formData.educationInfo);
    const sectionFieldError = (
      fieldErrors as Record<string, Record<string, string | undefined>>
    )?.[section]?.[field];

    setErrors((prev) => ({
      ...prev,
      educationInfo: {
        ...prev.educationInfo,
        [section]: {
          ...(
            prev.educationInfo as Record<
              string,
              Record<string, string | undefined>
            >
          )?.[section],
          [field]: sectionFieldError,
        },
      },
    }));
  };

  const handleEducationTypeChange = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      educationInfo: {
        ...prev.educationInfo,
        educationType: type as "Diploma" | "12th",
      },
    }));
  };

  const handleWorkExperienceChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: {
        ...prev.workExperience,
        [field]: value,
      },
    }));

    const fieldErrors = validateWorkExperience(formData.workExperience);
    if (fieldErrors[field as keyof typeof fieldErrors]) {
      setErrors((prev) => ({
        ...prev,
        workExperience: {
          ...prev.workExperience,
          [field]: fieldErrors[field as keyof typeof fieldErrors],
        },
      }));
    }
  };

  const handleSkillsChange = (skills: string[]) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: {
        ...prev.workExperience,
        skills,
      },
    }));
  };

  const handleWorkExperienceBlur = (field: string) => {
    setTouched((prev) => ({
      ...prev,
      workExperience: {
        ...prev.workExperience,
        [field]: true,
      },
    }));

    const fieldErrors = validateWorkExperience(formData.workExperience);
    setErrors((prev) => ({
      ...prev,
      workExperience: {
        ...prev.workExperience,
        [field]: fieldErrors[field as keyof typeof fieldErrors],
      },
    }));
  };

  const handleJobChange = (jobId: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: {
        ...prev.workExperience,
        jobs: prev.workExperience.jobs.map((job) =>
          job.id === jobId ? { ...job, [field]: value } : job,
        ),
      },
    }));

    if (field === "startDate" || field === "endDate") {
      setErrors((prev) => ({
        ...prev,
        workExperience: {
          ...prev.workExperience,
          jobs: {
            ...prev.workExperience.jobs,
            [jobId]: {
              ...prev.workExperience.jobs?.[jobId],
              [field]: undefined,
            },
          },
        },
      }));
      return;
    }

    const fieldErrors = validateWorkExperience(formData.workExperience);
    const jobFieldError =
      fieldErrors.jobs?.[jobId]?.[
        field as keyof (typeof fieldErrors.jobs)[typeof jobId]
      ];

    if (jobFieldError) {
      setErrors((prev) => ({
        ...prev,
        workExperience: {
          ...prev.workExperience,
          jobs: {
            ...prev.workExperience.jobs,
            [jobId]: {
              ...prev.workExperience.jobs?.[jobId],
              [field]: jobFieldError,
            },
          },
        },
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        workExperience: {
          ...prev.workExperience,
          jobs: {
            ...prev.workExperience.jobs,
            [jobId]: {
              ...prev.workExperience.jobs?.[jobId],
              [field]: undefined,
            },
          },
        },
      }));
    }
  };

  const handleJobBlur = (jobId: string, field: string) => {
    setTouched((prev) => ({
      ...prev,
      workExperience: {
        ...prev.workExperience,
        jobs: {
          ...prev.workExperience.jobs,
          [jobId]: {
            ...prev.workExperience.jobs?.[jobId],
            [field]: true,
          },
        },
      },
    }));

    const fieldErrors = validateWorkExperience(formData.workExperience);
    const jobFieldError =
      fieldErrors.jobs?.[jobId]?.[
        field as keyof (typeof fieldErrors.jobs)[typeof jobId]
      ];

    setErrors((prev) => ({
      ...prev,
      workExperience: {
        ...prev.workExperience,
        jobs: {
          ...prev.workExperience.jobs,
          [jobId]: {
            ...prev.workExperience.jobs?.[jobId],
            [field]: jobFieldError,
          },
        },
      },
    }));
  };

  const handleAddJob = () => {
    setFormData((prev) => ({
      ...prev,
      workExperience: {
        ...prev.workExperience,
        jobs: [...prev.workExperience.jobs, createEmptyJob()],
      },
    }));
  };

  const handleRemoveJob = (jobId: string) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: {
        ...prev.workExperience,
        jobs: prev.workExperience.jobs.filter((job) => job.id !== jobId),
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
            touched={touched.personalInfo}
            onChange={handlePersonalInfoChange}
            onBlur={handlePersonalInfoBlur}
          />
        );
      case 1:
        return (
          <EducationInfoStep
            data={formData.educationInfo}
            errors={errors.educationInfo}
            touched={touched.educationInfo}
            onChange={handleEducationChange}
            onBlur={handleEducationBlur}
            onEducationTypeChange={handleEducationTypeChange}
            birthYear={
              formData.personalInfo.dateOfBirth
                ? dayjs(formData.personalInfo.dateOfBirth, "DD/MM/YYYY")
                    .year()
                    .toString()
                : undefined
            }
          />
        );
      case 2:
        return (
          <WorkExperienceStep
            data={formData.workExperience}
            errors={errors.workExperience}
            touched={touched.workExperience}
            onChange={handleWorkExperienceChange}
            onSkillsChange={handleSkillsChange}
            onJobChange={handleJobChange}
            onJobBlur={handleJobBlur}
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
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          className={styles.formTitle}
        >
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
            {activeStep === STEPS.length - 1 ? "Submit" : "Next"}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Wizard;
