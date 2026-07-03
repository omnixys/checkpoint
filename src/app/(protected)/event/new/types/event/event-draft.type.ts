import type {
  CreateEventInput,
  CreateSettingsInput,
  EventAddressInput,
  EventCategory,
} from "@/checkpoint/generated/graphql";

export interface EventAddressDraft {
  street: string | null;
  houseNumber: string | null;
  postalCode: string | null;
  city: string;
  state: string | null;
  country: string;
  additionalInfo: string | null;
}

export interface CreateSettingsDraft extends CreateSettingsInput {
  logoUrl: string | null;
  coverImageUrl: string | null;
}

export interface ChildEventDraft {
  id: string;
  name: string;
  description?: string;
  startsAt?: string;
  endsAt?: string;
  maxSeats?: number;
  parentId?: string;
  category: EventCategory;
}

export interface CreateEventDraft {
  name: string;
  startsAt?: string;
  endsAt?: string;
  address?: EventAddressDraft;
  maxSeats?: number;
  settings: CreateSettingsDraft;
  children: ChildEventDraft[];
}

export const mapAddress = (address?: EventAddressDraft): EventAddressInput | null => {
  if (!address) {
    return null;
  }

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

export const mapSettings = (settings: CreateSettingsDraft): CreateSettingsInput => {
  const { logoUrl: _logoUrl, coverImageUrl: _coverImageUrl, ...input } = settings;
  return input;
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
    tags: null,
  };
};

export const mapEvent = (draft: CreateEventDraft): CreateEventInput => ({
  parentId: null,
  name: draft.name,

  address: mapAddress(draft.address),

  settings: mapSettings(draft.settings),

  children: draft.children?.map((child): CreateEventInput => mapChild(child, draft.settings)) ?? [],
  tags: null,
});
