// components/event-description/text/text.types.ts

export interface TextBlockProps {
  title?: string;
  content?: string; // markdown-like
  align?: string;
  isEditing?: boolean;
  onClickEdit?: () => void;
}
