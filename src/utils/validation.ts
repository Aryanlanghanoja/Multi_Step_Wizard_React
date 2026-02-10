import dayjs from "dayjs";
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
} from "../types";

const ALPHA_ONLY = /^[a-zA-Z\s]*$/;
const EMAIL_REGEX = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
const NUMERIC_ONLY = /^\d*$/;

export const validatePersonalInfo = (
  data: PersonalInfo,
): PersonalInfoErrors => {
  const errors: PersonalInfoErrors = {};

  if (!data.firstName.trim()) {
    errors.firstName = "First name is required";
  } else if (!ALPHA_ONLY.test(data.firstName)) {
    errors.firstName = "First name should contain only alphabets";
  }

  if (data.middleName && !ALPHA_ONLY.test(data.middleName)) {
    errors.middleName = "Middle name should contain only alphabets";
  }

  if (!data.lastName.trim()) {
    errors.lastName = "Last name is required";
  } else if (!ALPHA_ONLY.test(data.lastName)) {
    errors.lastName = "Last name should contain only alphabets";
  }

  if (!data.countryCode) {
    errors.countryCode = "Country code is required";
  }

  if (!data.phoneNumber.trim()) {
    errors.phoneNumber = "Phone number is required";
  } else if (!NUMERIC_ONLY.test(data.phoneNumber)) {
    errors.phoneNumber = "Phone number should contain only digits";
  } else if (data.phoneNumber.length < 10 || data.phoneNumber.length > 10) {
    errors.phoneNumber = "Phone number should be 10 digits";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!data.dateOfBirth) {
    errors.dateOfBirth = "Date of birth is required";
  } else {
    const dob = dayjs(data.dateOfBirth, "DD/MM/YYYY", true);
    if (!dob.isValid()) {
      errors.dateOfBirth = "Invalid date of birth";
    } else if (dob.isAfter(dayjs())) {
      errors.dateOfBirth = "Date of birth cannot be in the future";
    }
  }

  if (!data.about.trim()) {
    errors.about = "About is required";
  } else if (data.about.length > 500) {
    errors.about = "About section cannot exceed 500 characters";
  }

  return errors;
};

export const validateEducationInfo = (
  data: EducationInfo,
): EducationInfoErrors => {
  const errors: EducationInfoErrors = {};

  if (!data.tenth.passYear) {
    errors.tenth = { ...errors.tenth, passYear: "10th pass year is required" };
  }

  if (!data.tenth.board) {
    errors.tenth = { ...errors.tenth, board: "10th board is required" };
  }

  if (data.educationType === "12th") {
    if (!data.twelfth.passYear) {
      errors.twelfth = {
        ...errors.twelfth,
        passYear: "12th pass year is required",
      };
    }

    if (!data.twelfth.board) {
      errors.twelfth = { ...errors.twelfth, board: "12th board is required" };
    }
  } else if (data.educationType === "Diploma") {
    if (!data.diploma.passYear) {
      errors.diploma = {
        ...errors.diploma,
        passYear: "Diploma pass year is required",
      };
    }
    if (!data.diploma.organization.trim()) {
      errors.diploma = {
        ...errors.diploma,
        organization: "Organization is required",
      };
    }
    if (!data.diploma.major.trim()) {
      errors.diploma = { ...errors.diploma, major: "Major is required" };
    }
  }

  if (!data.graduation.completionYear) {
    errors.graduation = {
      ...errors.graduation,
      completionYear: "Graduation year is required",
    };
  }
  if (!data.graduation.organization.trim()) {
    errors.graduation = {
      ...errors.graduation,
      organization: "Organization is required",
    };
  }
  if (!data.graduation.degree) {
    errors.graduation = { ...errors.graduation, degree: "Degree is required" };
  }
  if (!data.graduation.major.trim()) {
    errors.graduation = { ...errors.graduation, major: "Major is required" };
  }

  return errors;
};

export const validateJobEntry = (job: JobEntry): JobEntryErrors => {
  const errors: JobEntryErrors = {};

  if (!job.startDate) {
    errors.startDate = "Start date is required";
  }

  if (!job.endDate) {
    errors.endDate = "End date is required";
  }

  if (job.startDate && job.endDate) {
    const start = new Date(job.startDate);
    const end = new Date(job.endDate);
    if (start >= end) {
      errors.endDate = "End date must be after start date";
    }
  }

  if (!job.designation.trim()) {
    errors.designation = "Designation is required";
  }

  if (!job.type) {
    errors.type = "Job type is required";
  }

  if (!job.description.trim()) {
    errors.description = "Description is required";
  }

  return errors;
};

export const validateWorkExperience = (
  data: WorkExperience,
): WorkExperienceErrors => {
  const errors: WorkExperienceErrors = {};

  if (!data.totalExperience) {
    errors.totalExperience = "Total experience is required";
  } else if (!/^\d*\.?\d*$/.test(data.totalExperience)) {
    errors.totalExperience = "Experience should be a number";
  } else if (parseFloat(data.totalExperience) < 0) {
    errors.totalExperience = "Experience cannot be negative";
  }

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

  if (!data.currentCTC) {
    errors.currentCTC = "Current CTC is required";
  } else if (!NUMERIC_ONLY.test(data.currentCTC.replace(/\./g, ""))) {
    errors.currentCTC = "CTC should be numeric";
  }

  if (!data.expectedCTC) {
    errors.expectedCTC = "Expected CTC is required";
  } else if (!NUMERIC_ONLY.test(data.expectedCTC.replace(/\./g, ""))) {
    errors.expectedCTC = "CTC should be numeric";
  }

  if (!data.availableFrom) {
    errors.availableFrom = "Available from date is required";
  } else {
    const availableDate = dayjs(data.availableFrom, "DD/MM/YYYY", true);
    if (!availableDate.isValid()) {
      errors.availableFrom = "Invalid date";
    } else if (availableDate.isBefore(dayjs().add(1, "day"), "day")) {
      errors.availableFrom = "Available date must be in the future";
    }
  }

  return errors;
};

export const isPersonalInfoValid = (errors: PersonalInfoErrors): boolean => {
  return Object.keys(errors).length === 0;
};

export const isEducationInfoValid = (errors: EducationInfoErrors): boolean => {
  return Object.keys(errors).length === 0;
};

export const isWorkExperienceValid = (
  errors: WorkExperienceErrors,
): boolean => {
  return Object.keys(errors).length === 0;
};

export const validateForm = (data: FormData): FormErrors => {
  return {
    personalInfo: validatePersonalInfo(data.personalInfo),
    educationInfo: validateEducationInfo(data.educationInfo),
    workExperience: validateWorkExperience(data.workExperience),
  };
};

export const validateStep = (
  stepIndex: number,
  data: FormData,
): PersonalInfoErrors | EducationInfoErrors | WorkExperienceErrors => {
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
