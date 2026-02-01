export interface EditorPanelProps {
  open: boolean;
  sectionId?: string;
  sectionType?: string;
  sectionProps?: any;
  onClose: () => void;
  onSave: (updatedProps: any) => void;
  onChangeLive?: (values: any) => void;
}
