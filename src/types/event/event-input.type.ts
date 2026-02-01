import { SeatingConfigInput } from "../../seat/seat-input.type";

// export type CreateEventInput = {
//   name: string;
//   startsAt: string;
//   endsAt: string;
//   allowReEntry?: boolean;
//   maxSeats?: number;
//   rotateSeconds?: number;
//   location?: string;
//   dressCode?: string;
//   description?: string;
//   defaultSection?: number
//   defaultTable?: number;
// };

export type CreateEventInput = {
  name: string;
  startsAt: string;
  endsAt: string;
  allowReEntry: boolean;
  rotateSeconds: number;
  maxSeats: number;
  address?: AddressInput;
  settings?: SettingsInput;
  theme?: ThemeInput;
  media?: MediaInput[];
  description?: DescriptionBlockInput[];
  faqs?: FAQInput[];
  team?: TeamMemberInput[];
  timeline?: TimelineInput[];
  config?: SeatingConfigInput;
};

export type AddressInput = {
  street: string;
  city: string;
  zip: string;
  country: string;
};

export type SettingsInput = {
  data?: Record<string, any>;
};

export type TeamMemberInput = {
  name: string;
  role: string;
  imageUrl?: string;
  order?: number;
};

export class ThemeInput {
  colors?: Record<string, any>;
  layout?: Record<string, any>;
  typography?: Record<string, any>;
}

export type TimelineInput = {
  type: string;
  timestamp: string;
  label: string;
};

export type FAQInput = {
  question: string;
  answer: string;
  order?: number;
};

export type MediaInput = {
  kind: string;
  url: string;
  alt?: string;
  order?: number;
};

export type DescriptionBlockInput = {
  type: string;
  order?: number;
  visible: boolean;
  props: Record<string, any>;
};
