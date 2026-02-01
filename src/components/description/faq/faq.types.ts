export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQBlockProps {
  items?: FAQItem[];
  isEditing?: boolean;
  onClickEdit?: () => void;
}
