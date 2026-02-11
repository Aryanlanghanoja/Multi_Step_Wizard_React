import type { JobEntry } from "../types";
import { generateId } from "../services/indexedDB";

export const createEmptyJob = (): JobEntry => ({
  id: generateId(),
  startDate: "",
  endDate: "",
  designation: "",
  type: "",
  description: "",
  organization: "",
});
