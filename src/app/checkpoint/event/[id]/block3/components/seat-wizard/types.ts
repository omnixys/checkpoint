export interface SeatConfig {
  count: number;
  shape: "circle" | "spiral" | "scatter" | "u" | "vip";
  meta?: any;
}

export interface TableConfig {
  name?: string;
  shape: "circle" | "grid" | "row";
  seats: SeatConfig;
  order?: number;
  meta?: any;
}

export interface SectionConfig {
  name: string;
  shape: "circle" | "horseshoe" | "u" | "vip" | "grid";
  tables: TableConfig[];
  order?: number;
  meta?: any;
}

export interface WizardData {
  sections: SectionConfig[];
}

export const emptyWizardData: WizardData = {
  sections: [],
};
