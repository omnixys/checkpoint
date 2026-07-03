export interface StepValidationResult {
  valid: boolean;
  errors: string[];
}

export enum CreateEventWizardStep {
  BASICS = 0,
  ADDRESS = 1,
  SETTINGS = 2,
  VISIBILITY = 3,
  EXPERIENCE = 4,
  CHILDREN = 5,
  SUMMARY = 6,
  SUCCESS = 7,
}
