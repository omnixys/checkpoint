export type EventAddressDraft = {
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city: string;
  state?: string;
  country: string;
  additionalInfo?: string;
};



export interface CreateSettingsDraft {
  allowReEntry: boolean;
  rotateSeconds: number;
  maxSeats: number;
  allowPublicRsvp: boolean;
  allowPublicPlusOne: boolean;
  allowPublicRsvpWebsite: boolean;
  publicRsvpWebsite?: string;
  isActive: boolean;
  isPublic: boolean;
  coverImageUrl?: string;
  logoUrl?: string;
  dressCode?: string;
  description?: string;
  descriptionLong?: string;
  startsAt?: string;
  endsAt?: string;
  category?: string;
}

export type ChildEventDraft = {
  id: string;
  name: string;
  description?: string;
  startsAt?: string;
  endsAt?: string;
  maxSeats?: number;
  parentId?: string;
  category: string;
};

export type CreateEventDraft = {
  name: string;
  startsAt?: string;
  endsAt?: string;
  address?: EventAddressDraft;
  maxSeats?: number;
  settings: CreateSettingsDraft;
  children: ChildEventDraft[];
};
