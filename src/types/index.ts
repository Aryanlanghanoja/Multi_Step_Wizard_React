// Personal Information Types
export interface PersonalInfo {
  firstName: string;
  middleName: string;
  lastName: string;
  countryCode: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
}

// Education Types
export type BoardType = 'ICSE' | 'CBSE' | 'State Board' | '';
export type EducationType = 'diploma' | '12th';

export interface TenthDetails {
  passYear: string;
  board: BoardType;
}

export interface TwelfthDetails {
  passYear: string;
  board: BoardType;
}

export interface DiplomaDetails {
  passYear: string;
  organization: string;
  major: string;
}

export interface GraduationDetails {
  completionYear: string;
  organization: string;
  degree: string;
  major: string;
}

export interface EducationInfo {
  tenth: TenthDetails;
  educationType: EducationType;
  twelfth: TwelfthDetails;
  diploma: DiplomaDetails;
  graduation: GraduationDetails;
}

// Work Experience Types
export type JobType = 'Full Time' | 'Part Time' | 'Internship' | '';

export interface JobEntry {
  id: string;
  startDate: string;
  endDate: string;
  designation: string;
  type: JobType;
  description: string;
}

export interface WorkExperience {
  totalExperience: string;
  jobs: JobEntry[];
  currentCTC: string;
  expectedCTC: string;
  availableFrom: string;
}

// Complete Form Data
export interface FormData {
  id?: string;
  personalInfo: PersonalInfo;
  educationInfo: EducationInfo;
  workExperience: WorkExperience;
  createdAt?: string;
  updatedAt?: string;
}

// Validation Errors
export interface PersonalInfoErrors {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  countryCode?: string;
  phoneNumber?: string;
  email?: string;
  dateOfBirth?: string;
}

export interface EducationInfoErrors {
  tenth?: {
    passYear?: string;
    board?: string;
  };
  twelfth?: {
    passYear?: string;
    board?: string;
  };
  diploma?: {
    passYear?: string;
    organization?: string;
    major?: string;
  };
  graduation?: {
    completionYear?: string;
    organization?: string;
    degree?: string;
    major?: string;
  };
}

export interface JobEntryErrors {
  startDate?: string;
  endDate?: string;
  designation?: string;
  type?: string;
  description?: string;
}

export interface WorkExperienceErrors {
  totalExperience?: string;
  jobs?: { [key: string]: JobEntryErrors };
  currentCTC?: string;
  expectedCTC?: string;
  availableFrom?: string;
}

export interface FormErrors {
  personalInfo: PersonalInfoErrors;
  educationInfo: EducationInfoErrors;
  workExperience: WorkExperienceErrors;
}

// Country Code Type
export interface CountryCode {
  code: string;
  label: string;
  phone: string;
}
