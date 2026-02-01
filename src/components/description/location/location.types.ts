export interface LocationBlockProps {
  title?: string;
  address?: string;
  image?: string;
  mapEmbedUrl?: string;
  isEditing?: boolean;
  onClickEdit?: () => void;
}
