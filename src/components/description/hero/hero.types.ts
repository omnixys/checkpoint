// components/event-description/hero/hero.types.ts

export interface HeroBlockProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  overlayOpacity?: number; // 0.0 - 1.0
  height?: number | string;
  isEditing?: boolean;
  onClickEdit?: () => void;
}
