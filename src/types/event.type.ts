import { UserRoleType } from "@/checkpoint/generated/graphql";

export type EventsFilter = "all" | "upcoming" | "now" | "past";
export type EventListHandle = {
  refresh: () => void;
};

export type EventViweMode = "list" | "grid";
export type EventVisualOverride = "auto" | "image" | "banner" | "none";

export interface EventBase {
  id: string;
  name: string;
  owner: string;
  parentId: string | null;
  path: string | null;
  depth: number;
  createdAt: any;
  updatedAt: any;
  myRole: UserRoleType | null;
}

export interface EventListItem {
  id: string;
  name: string;
  myRole: UserRoleType | null;
}

export interface EventMetaDTO {
  id: string;
  name: string;
  owner: string;
  parentId?: string;
  children?: {
    id: string;
    name: string;
  }[];
}

export interface EventTree extends EventBase {
  children?: EventBase[];
}
