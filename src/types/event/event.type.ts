import { EventRole, Visualstyle } from "./event-enum.type";

export interface Event {
  id: string;
  name: string;
  startsAt: string;
  endsAt: string;
  allowReEntry: boolean;
  maxSeats: number;
  rotateSeconds: number;
  dressCode: string;
  description: string;
  createdAt: string;
  updatedAt: string;

  address: EventAddress;
  userRoles: UserEventRole[];
  timeline: EventTimeline[];
  auditLogs: EventAuditLog[];

  team: EventTeamMember[];
  faqs: EventFAQ[];
  fullDescription: EventDescriptionBlock[];
  media: EventMedia[];

  theme?: EventTheme;
  settings?: EventSettings;

  isActive: boolean;
  myRole?: EventRole;
}

export interface EventAddress {
  id: string;
  eventId: string;
  street: string;
  city: string;
  zip: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface UserEventRole {
  id: string;
  eventId: string;
  userId: string;
  role: EventRole;
}

export interface EventTimeline {
  id: string;
  eventId: string;
  type: string;
  timestamp: string;
  label: string;
}

export interface EventAuditLog {
  id: string;
  eventId: string;
  actorId: string;
  action: string;
  data: any | null;
  createdAt: string;
}

export interface EventTeamMember {
  id: string;
  eventId: string;
  name: string;
  role: string;
  imageUrl: string | null;
  order: number;
}

export interface EventFAQ {
  id: string;
  eventId: string;
  question: string;
  answer: string;
  order: number;
}

export type EventDescriptionBlock =
  | {
      id: string;
      eventId: string;
      type: "hero";
      order: number;
      visible: boolean;
      props: HeroProps;
    }
  | {
      id: string;
      eventId: string;
      type: "text";
      order: number;
      visible: boolean;
      props: TextProps;
    }
  | {
      id: string;
      eventId: string;
      type: "gallery";
      order: number;
      visible: boolean;
      props: GalleryProps;
    }
  | {
      id: string;
      eventId: string;
      type: "features";
      order: number;
      visible: boolean;
      props: FeaturesProps;
    }
  | {
      id: string;
      eventId: string;
      type: "timeline";
      order: number;
      visible: boolean;
      props: TimelineProps;
    }
  | {
      id: string;
      eventId: string;
      type: "location";
      order: number;
      visible: boolean;
      props: LocationProps;
    }
  | {
      id: string;
      eventId: string;
      type: "team";
      order: number;
      visible: boolean;
      props: TeamProps;
    }
  | {
      id: string;
      eventId: string;
      type: "faq";
      order: number;
      visible: boolean;
      props: FAQProps;
    }
  | {
      id: string;
      eventId: string;
      type: "quote";
      order: number;
      visible: boolean;
      props: QuoteProps;
    };

export type DescriptionProps =
  | HeroProps
  | TextProps
  | GalleryProps
  | FeaturesProps
  | TimelineProps
  | LocationProps
  | TeamProps
  | FAQProps
  | QuoteProps
  | Record<string, any>;

export interface HeroProps {
  title?: string;
  subtitle?: string;
  height?: string;
  overlayOpacity?: number;
  backgroundImage?: string;
}

export interface TextProps {
  align?: string;
  title?: string;
  content?: string;
}

export interface GalleryProps {
  images: string[];
  aspectRatio?: string;
}

export interface FeaturesProps {
  items?: Array<{
    icon: string;
    title: string;
    description?: string;
  }>;
  isEditing?: boolean;
  onClickEdit?: () => void;
}

export interface TimelineProps {
  steps: Array<{
    time: string;
    title: string;
    description: string;
  }>;
}

export interface LocationProps {
  image: string;
  title: string;
  address: string;
  mapEmbedUrl: string;
}

export interface TeamProps {
  members: Array<{
    name: string;
    role: string;
    bio: string;
    image: string;
  }>;
}

export interface FAQProps {
  items?: Array<{
    question: string;
    answer: string;
  }>;
  isEditing?: boolean;
  onClickEdit?: () => void;
}

export interface QuoteProps {
  quote: string;
  author?: string;
}

export interface EventMedia {
  id: string;
  eventId: string;
  kind: string;
  url: string;
  alt: string | null;
  order: number;
}

export interface EventTheme {
  id: string;
  eventId: string;
  colors?: Record<string, any>;
  layout?: Record<string, any>;
  typography?: Record<string, any>;
}

export interface EventSettings {
  id: string;
  eventId: string;
  data: Record<string, any>;
  visualStyle: Visualstyle;
}

export type EventsFilter = "all" | "upcoming" | "now" | "past";
export type EventListHandle = {
  refresh: () => void;
};

export type SectionType =
  | "hero"
  | "text"
  | "gallery"
  | "features"
  | "timeline"
  | "location"
  | "team"
  | "faq"
  | "quote";
