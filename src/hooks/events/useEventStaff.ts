"use client";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

export interface StaffPersonalInfo {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}

export interface StaffPhoneNumber {
  number: string;
  type?: string | null;
  label?: string | null;
  isPrimary?: boolean | null;
}

export interface EventStaffMember {
  userId: string;
  username?: string | null;
  roles: string[];
  permissions: string[];
  personalInfo?: StaffPersonalInfo | null;
  phoneNumbers?: StaffPhoneNumber[] | null;
  email?: string | null;
}

export function resolveStaffName(staff: EventStaffMember): string {
  if (staff.personalInfo?.firstName) {
    return `${staff.personalInfo.firstName} ${staff.personalInfo.lastName ?? ""}`.trim();
  }
  if (staff.username) return staff.username;
  return `Staff #${staff.userId.slice(0, 8)}`;
}

const EVENT_STAFF_QUERY = gql`
  query EventStaff($eventId: ID!) {
    eventStaff(eventId: $eventId) {
      userId
      username
      roles
      permissions
      personalInfo {
        firstName
        lastName
        email
      }
      phoneNumbers {
        number
        type
        label
        isPrimary
      }
      email
    }
  }
`;

interface Props {
  eventId?: string;
  skip?: boolean;
}

export function useEventStaff({ eventId, skip = false }: Props) {
  const { data, loading, error, refetch } = useQuery<{
    eventStaff: EventStaffMember[];
  }>(EVENT_STAFF_QUERY, {
    variables: { eventId },
    skip: !eventId || skip,
    fetchPolicy: "cache-and-network",
  });

  const staff = data?.eventStaff ?? [];

  const staffMap = new Map(staff.map((s) => [s.userId, s]));

  return { staff, staffMap, loading, error, refetch };
}
