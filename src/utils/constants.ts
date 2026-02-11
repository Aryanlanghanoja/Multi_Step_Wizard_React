import type { CountryCode, BoardType, JobType } from "../types";

export const COUNTRY_CODES: CountryCode[] = [
  { code: "IN", label: "India", phone: "+91" },
  { code: "US", label: "United States", phone: "+1" },
  { code: "GB", label: "United Kingdom", phone: "+44" },
  { code: "CA", label: "Canada", phone: "+1" },
  { code: "AU", label: "Australia", phone: "+61" },
  { code: "DE", label: "Germany", phone: "+49" },
  { code: "FR", label: "France", phone: "+33" },
  { code: "JP", label: "Japan", phone: "+81" },
  { code: "CN", label: "China", phone: "+86" },
  { code: "BR", label: "Brazil", phone: "+55" },
  { code: "AE", label: "UAE", phone: "+971" },
  { code: "SG", label: "Singapore", phone: "+65" },
];

export const BOARD_OPTIONS: BoardType[] = ["ICSE", "CBSE", "State Board"];

export const JOB_TYPE_OPTIONS: JobType[] = [
  "Full Time",
  "Part Time",
  "Internship",
];

export const DEGREE_OPTIONS: string[] = [
  "B.A.",
  "B.Com",
  "B.E.",
  "B.Sc",
  "B.Tech",
  "BBA",
  "BCA",
  "M.A.",
  "M.Com",
  "M.E.",
  "M.Sc",
  "M.Tech",
  "MBA",
  "MCA",
  "PhD",
];

const currentYear = new Date().getFullYear();
export const YEAR_OPTIONS: string[] = Array.from(
  { length: currentYear - 1947 + 10 },
  (_, i) => (1947 + i).toString(),
).reverse();

export const generateYearOptions = (birthYear?: string): string[] => {
  if (!birthYear) {
    return YEAR_OPTIONS;
  }

  const birth = parseInt(birthYear);
  if (isNaN(birth)) {
    return YEAR_OPTIONS;
  }

  // Start from birth year + 10 (typical age for 10th standard)
  const startYear = birth;
  const endYear = currentYear + 30;
  const length = Math.max(1, endYear - startYear + 1);
  return Array.from({ length }, (_, i) => (startYear + i).toString()).reverse();
};

export const SKILLS_OPTIONS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "C#",
  "PHP",
  "Ruby",
  "Go",
  "Rust",
  "HTML",
  "CSS",
  "SASS",
  "SQL",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "AWS",
  "Azure",
  "Docker",
  "Kubernetes",
  "Git",
  "Linux",
  "Agile",
  "Scrum",
  "REST API",
  "GraphQL",
];

export const STEPS = [
  "Personal Information",
  "Education Details",
  "Work Experience",
];
