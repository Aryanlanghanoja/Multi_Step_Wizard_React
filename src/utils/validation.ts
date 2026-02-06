import type {
  PersonalInfo,
  EducationInfo,
  WorkExperience,
  PersonalInfoErrors,
  EducationInfoErrors,
  WorkExperienceErrors,
  JobEntry,
  JobEntryErrors,
  FormData,
  FormErrors,
} from '../types';

// Regex patterns
const ALPHA_ONLY = /^[a-zA-Z\s]*$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NUMERIC_ONLY = /^\d*$/;

// Validate Personal Information
export const validatePersonalInfo = (data: PersonalInfo): PersonalInfoErrors => {
  const errors: PersonalInfoErrors = {};

  // First Name
  if (!data.firstName.trim()) {
    errors.firstName = 'First name is required';
  } else if (!ALPHA_ONLY.test(data.firstName)) {
    errors.firstName = 'First name should contain only alphabets';
  }

  // Middle Name (optional but must be alphabets if provided)
  if (data.middleName && !ALPHA_ONLY.test(data.middleName)) {
    errors.middleName = 'Middle name should contain only alphabets';
  }

  // Last Name
  if (!data.lastName.trim()) {
    errors.lastName = 'Last name is required';
  } else if (!ALPHA_ONLY.test(data.lastName)) {
    errors.lastName = 'Last name should contain only alphabets';
  }

  // Country Code
  if (!data.countryCode) {
    errors.countryCode = 'Country code is required';
  }

  // Phone Number
  if (!data.phoneNumber.trim()) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!NUMERIC_ONLY.test(data.phoneNumber)) {
    errors.phoneNumber = 'Phone number should contain only digits';
  } else if (data.phoneNumber.length < 7 || data.phoneNumber.length > 15) {
    errors.phoneNumber = 'Phone number should be 7-15 digits';
  }

  // Email
  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Date of Birth
  if (!data.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required';
  } else {
    const dob = new Date(data.dateOfBirth);
    const today = new Date();
    if (dob > today) {
      errors.dateOfBirth = 'Date of birth cannot be in the future';
    }
  }

  return errors;
};

// Validate Education Information
export const validateEducationInfo = (data: EducationInfo): EducationInfoErrors => {
  const errors: EducationInfoErrors = {};

  // 10th Details
  if (!data.tenth.passYear) {
    errors.tenth = { ...errors.tenth, passYear: '10th pass year is required' };
  }
  if (!data.tenth.board) {
    errors.tenth = { ...errors.tenth, board: '10th board is required' };
  }

  // 12th or Diploma based on selection
  if (data.educationType === '12th') {
    if (!data.twelfth.passYear) {
      errors.twelfth = { ...errors.twelfth, passYear: '12th pass year is required' };
    }
    if (!data.twelfth.board) {
      errors.twelfth = { ...errors.twelfth, board: '12th board is required' };
    }
  } else if (data.educationType === 'diploma') {
    if (!data.diploma.passYear) {
      errors.diploma = { ...errors.diploma, passYear: 'Diploma pass year is required' };
    }
    if (!data.diploma.organization.trim()) {
      errors.diploma = { ...errors.diploma, organization: 'Organization is required' };
    }
    if (!data.diploma.major.trim()) {
      errors.diploma = { ...errors.diploma, major: 'Major is required' };
    }
  }

  // Graduation Details
  if (!data.graduation.completionYear) {
    errors.graduation = { ...errors.graduation, completionYear: 'Graduation year is required' };
  }
  if (!data.graduation.organization.trim()) {
    errors.graduation = { ...errors.graduation, organization: 'Organization is required' };
  }
  if (!data.graduation.degree) {
    errors.graduation = { ...errors.graduation, degree: 'Degree is required' };
  }
  if (!data.graduation.major.trim()) {
    errors.graduation = { ...errors.graduation, major: 'Major is required' };
  }

  return errors;
};

// Validate single job entry
export const validateJobEntry = (job: JobEntry): JobEntryErrors => {
  const errors: JobEntryErrors = {};

  if (!job.startDate) {
    errors.startDate = 'Start date is required';
  }

  if (!job.endDate) {
    errors.endDate = 'End date is required';
  }

  if (job.startDate && job.endDate) {
    const start = new Date(job.startDate);
    const end = new Date(job.endDate);
    if (start >= end) {
      errors.endDate = 'End date must be after start date';
    }
  }

  if (!job.designation.trim()) {
    errors.designation = 'Designation is required';
  }

  if (!job.type) {
    errors.type = 'Job type is required';
  }

  if (!job.description.trim()) {
    errors.description = 'Description is required';
  }

  return errors;
};

// Validate Work Experience
export const validateWorkExperience = (data: WorkExperience): WorkExperienceErrors => {
  const errors: WorkExperienceErrors = {};

  // Total Experience
  if (!data.totalExperience) {
    errors.totalExperience = 'Total experience is required';
  } else if (!NUMERIC_ONLY.test(data.totalExperience)) {
    errors.totalExperience = 'Experience should be a number';
  } else if (parseInt(data.totalExperience) < 0) {
    errors.totalExperience = 'Experience cannot be negative';
  }

  // Job Entries
  if (data.jobs.length > 0) {
    const jobErrors: { [key: string]: JobEntryErrors } = {};
    data.jobs.forEach((job) => {
      const entryErrors = validateJobEntry(job);
      if (Object.keys(entryErrors).length > 0) {
        jobErrors[job.id] = entryErrors;
      }
    });
    if (Object.keys(jobErrors).length > 0) {
      errors.jobs = jobErrors;
    }
  }

  // Current CTC
  if (!data.currentCTC) {
    errors.currentCTC = 'Current CTC is required';
  } else if (!NUMERIC_ONLY.test(data.currentCTC.replace(/\./g, ''))) {
    errors.currentCTC = 'CTC should be numeric';
  }

  // Expected CTC
  if (!data.expectedCTC) {
    errors.expectedCTC = 'Expected CTC is required';
  } else if (!NUMERIC_ONLY.test(data.expectedCTC.replace(/\./g, ''))) {
    errors.expectedCTC = 'CTC should be numeric';
  }

  // Available From
  if (!data.availableFrom) {
    errors.availableFrom = 'Available from date is required';
  }

  return errors;
};

// Check if step has errors
export const isPersonalInfoValid = (errors: PersonalInfoErrors): boolean => {
  return Object.keys(errors).length === 0;
};

export const isEducationInfoValid = (errors: EducationInfoErrors): boolean => {
  return Object.keys(errors).length === 0;
};

export const isWorkExperienceValid = (errors: WorkExperienceErrors): boolean => {
  return Object.keys(errors).length === 0;
};

// Validate entire form
export const validateForm = (data: FormData): FormErrors => {
  return {
    personalInfo: validatePersonalInfo(data.personalInfo),
    educationInfo: validateEducationInfo(data.educationInfo),
    workExperience: validateWorkExperience(data.workExperience),
  };
};

// Validate specific step
export const validateStep = (stepIndex: number, data: FormData): PersonalInfoErrors | EducationInfoErrors | WorkExperienceErrors => {
  switch (stepIndex) {
    case 0:
      return validatePersonalInfo(data.personalInfo);
    case 1:
      return validateEducationInfo(data.educationInfo);
    case 2:
      return validateWorkExperience(data.workExperience);
    default:
      return {};
  }
};
