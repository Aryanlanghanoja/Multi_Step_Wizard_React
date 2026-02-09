import type { CountryCode, BoardType, JobType } from '../types';

export const COUNTRY_CODES: CountryCode[] = [
  { code: 'IN', label: 'India', phone: '+91' },
  { code: 'US', label: 'United States', phone: '+1' },
  { code: 'GB', label: 'United Kingdom', phone: '+44' },
  { code: 'CA', label: 'Canada', phone: '+1' },
  { code: 'AU', label: 'Australia', phone: '+61' },
  { code: 'DE', label: 'Germany', phone: '+49' },
  { code: 'FR', label: 'France', phone: '+33' },
  { code: 'JP', label: 'Japan', phone: '+81' },
  { code: 'CN', label: 'China', phone: '+86' },
  { code: 'BR', label: 'Brazil', phone: '+55' },
  { code: 'AE', label: 'UAE', phone: '+971' },
  { code: 'SG', label: 'Singapore', phone: '+65' },
];

export const BOARD_OPTIONS: BoardType[] = ['ICSE', 'CBSE', 'State Board'];

export const JOB_TYPE_OPTIONS: JobType[] = ['Full Time', 'Part Time', 'Internship'];

export const DEGREE_OPTIONS: string[] = [
  'B.Tech',
  'B.E.',
  'B.Sc',
  'B.Com',
  'B.A.',
  'BBA',
  'BCA',
  'M.Tech',
  'M.E.',
  'M.Sc',
  'M.Com',
  'M.A.',
  'MBA',
  'MCA',
  'PhD',
];

const currentYear = new Date().getFullYear();
export const YEAR_OPTIONS: string[] = Array.from(
  { length: currentYear - 1970 + 6 },
  (_, i) => (1970 + i).toString()
).reverse();

export const STEPS = ['Personal Information', 'Education Details', 'Work Experience'];
