export interface TimelineStep {
  time: string;
  title: string;
  description?: string;
}

export interface TimelineBlockProps {
  steps?: TimelineStep[];
  isEditing?: boolean;
  onClickEdit?: () => void;
}
