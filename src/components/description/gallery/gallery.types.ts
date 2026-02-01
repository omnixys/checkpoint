// components/event-description/gallery/gallery.types.ts
export interface GalleryBlockProps {
  images?: string[];
  aspectRatio?: string;
  layout?: "grid" | "masonry";
  isEditing?: boolean;
  onClickEdit?: () => void;
}
