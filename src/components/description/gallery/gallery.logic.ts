// components/event-description/gallery/gallery.logic.ts
"use client";

export function useGalleryLogic(images: string[]) {
  return { count: images.length };
}
