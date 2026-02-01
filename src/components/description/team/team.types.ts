export interface TeamMember {
  name: string;
  role: string;
  image?: string;
  bio?: string;
}

export interface TeamBlockProps {
  members?: TeamMember[];
  isEditing?: boolean;
  onClickEdit?: () => void;
}
