// components/event-description/features/features.types.ts

export interface FeatureItem {
  icon: string;
  title: string;
  description?: string;
}

export interface FeaturesBlockProps {
  items?: FeatureItem[];
  isEditing?: boolean;
  onClickEdit?: () => void;
}
