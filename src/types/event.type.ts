import type {
  EventPageQuery,
  GetEventSettingsQuery,
  GetGuestListQuery,
  GetInvitationQuery,
} from "@/checkpoint/generated/graphql";
import type { Safe, StripMeta } from "@/checkpoint/types/core/core.type";

export type EventsFilter = "all" | "upcoming" | "now" | "past";
export interface EventListHandle {
  refresh: () => void;
}

export type EventViweMode = "list" | "grid";
export type EventVisualOverride = "auto" | "image" | "banner" | "none";

// export interface EventBase {
//   id: string;
//   name: string;
//   owner: string;
//   parentId: string | null;
//   path: string | null;
//   depth: number;
//   createdAt: any;
//   updatedAt: any;
//   myRole: UserRoleType | null;
// }

// export interface EventListItem {
//   id: string;
//   name: string;
//   myRole: UserRoleType | null;
// }

export interface EventMetaDTO {
  id: string;
  name: string;
  owner: string;
  parentId?: string;
}

// export interface EventTree extends EventBase {
//   children?: EventBase[];
// }

export type EventRoleType = StripMeta<Safe<GetEventSettingsQuery["event"]>["userRoles"][number]>;
export type GuestType = StripMeta<GetGuestListQuery["getUserList"][number]>;

// TODO Export Types
export type PlusOne = GetInvitationQuery["invitation"]["plusOnes"][number];
export type PhoneNumber = PlusOne["phoneNumbers"][number];
type NormalizedPhoneNumber = Omit<PhoneNumber, "id" | "__typename">;

export type NormalizedPlusOne = Omit<PlusOne, "id" | "phoneNumbers" | "__typename"> & {
  phoneNumbers: NormalizedPhoneNumber[];
};

export type CoverMediaType = Safe<EventPageQuery["event"]>["coverMedia"];
