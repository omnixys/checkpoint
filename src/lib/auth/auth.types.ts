import { RealmRoleType } from "@/checkpoint/generated/graphql";

export interface CurrentUser {
  id: string;
  username: string;
  email?: string | undefined;
  role?: RealmRoleType | undefined;
}
