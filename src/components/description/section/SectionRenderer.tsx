// components/event-description/SectionRenderer.tsx
"use client";

import { EventDescriptionBlock } from "@/components/../types/event/event.type";
import FAQBlock from "@/components/description/faq/faq.block";
import FeaturesBlock from "@/components/description/features/features.block";
import GalleryBlock from "@/components/description/gallery/gallery.block";
import HeroBlock from "@/components/description/hero/hero.block";
import LocationBlock from "@/components/description/location/location.block";
import QuoteBlock from "@/components/description/quote/quote.block";
import TeamBlock from "@/components/description/team/team.block";
import TextBlock from "@/components/description/text/text.block";
import TimelineBlock from "@/components/description/timeline/timeline.block";

interface Props {
  sections: EventDescriptionBlock[];
  isAdmin?: boolean;
  onEdit?: (id: string) => void;
}

export default function SectionRenderer({ sections, isAdmin, onEdit }: Props) {
  return (
    <>
      {sections
        .filter((s) => s.visible !== false)
        .map((section) => {
          const extra = {
            isEditing: !!isAdmin,
            onClickEdit: () => onEdit?.(section.id),
          };

          switch (section.type) {
            case "hero":
              return (
                <HeroBlock key={section.id} {...section.props} {...extra} />
              );

            case "text":
              return (
                <TextBlock key={section.id} {...section.props} {...extra} />
              );

            case "gallery":
              return (
                <GalleryBlock key={section.id} {...section.props} {...extra} />
              );

            case "features":
              return (
                <FeaturesBlock key={section.id} {...section.props} {...extra} />
              );

            case "timeline":
              return (
                <TimelineBlock key={section.id} {...section.props} {...extra} />
              );

            case "location":
              return (
                <LocationBlock key={section.id} {...section.props} {...extra} />
              );

            case "team":
              return (
                <TeamBlock key={section.id} {...section.props} {...extra} />
              );

            case "faq":
              return (
                <FAQBlock key={section.id} {...section.props} {...extra} />
              );

            case "quote":
              return (
                <QuoteBlock key={section.id} {...section.props} {...extra} />
              );

            default:
              return null;
          }
        })}
    </>
  );
}
