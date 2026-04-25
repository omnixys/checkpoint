import { CreateEventInput, EventAddressInput, EventCategory } from "@/checkpoint/generated/graphql";

export type EventAddressDraft = {
  street: string | null;
  houseNumber: string | null;
  postalCode: string | null;
  city: string;
  state: string | null;
  country: string;
  additionalInfo: string | null;
};



export interface CreateSettingsDraft {
  allowReEntry: boolean;
  rotateSeconds: number;
  maxSeats: number;
  allowPublicRsvp: boolean;
  allowPublicPlusOne: boolean;
  allowPublicRsvpWebsite: boolean;
  publicRsvpWebsite: string | null;
  isActive: boolean;
  isPublic: boolean;
  dressCode: string | null;
  description: string | null;

  logoUrl: string | null;
  coverImageUrl: string | null;
  
  // descriptionLong: string | null;
  startsAt: string | null;
  endsAt: string | null;
  category: EventCategory;
}

export type ChildEventDraft = {
  id: string;
  name: string;
  description?: string;
  startsAt?: string;
  endsAt?: string;
  maxSeats?: number;
  parentId?: string;
  category: EventCategory;
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




export const mapAddress = (
  address?: EventAddressDraft,
): EventAddressInput | null => {
  if (!address) return null;

  return {
    street: address.street ?? null,
    houseNumber: address.houseNumber ?? null,
    postalCode: address.postalCode ?? null,
    city: address.city,
    state: address.state ?? null,
    country: address.country,
    additionalInfo: address.additionalInfo ?? null,
  };
};

export const mapSettings = (
  settings: CreateSettingsDraft,
): any /* ideally generated type */ => {
   const { logoUrl, coverImageUrl, ...rest } = settings;
  return {
    ...rest,
  };
};

const mapChild = (
  child: ChildEventDraft,
  parentSettings: CreateSettingsDraft,
): CreateEventInput => {
  return {
    parentId: null, // immer null im Create Flow

    name: child.name,

    address: null, // aktuell kein address im child

    settings: mapSettings({
      ...parentSettings,
      maxSeats: child.maxSeats ?? parentSettings.maxSeats,
      startsAt: child.startsAt ?? parentSettings.startsAt,
      endsAt: child.endsAt ?? parentSettings.endsAt,
      category: child.category ?? parentSettings.category,
      description: child.description ?? parentSettings.description,
    }),

    children: [],
  };
};

export const mapEvent = (
  draft: CreateEventDraft,
): CreateEventInput => {
  return {
    parentId: null,
    name: draft.name,

    address: mapAddress(draft.address),

    settings: mapSettings(draft.settings),

    children:
      draft.children?.map(
        (child): CreateEventInput => mapChild(child, draft.settings),
      ) ?? [],
  };
};