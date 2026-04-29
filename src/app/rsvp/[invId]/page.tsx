"use server";

import RsvpPageClient from "@/checkpoint/app/rsvp/[invId]/pageClient";
import RsvpLoading from "@/checkpoint/app/rsvp/loading";
import {
  GetAllCallingCodesDocument,
  GetAllCallingCodesQuery,
  GetAllCallingCodesQueryVariables,
  GetAllCountriesDocument,
  GetAllCountriesQuery,
  GetAllCountriesQueryVariables,
} from "@/checkpoint/generated/graphql";
import { createServerClient } from "@/checkpoint/lib/apollo/server-client";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";
import { CallingCodeCountry } from "@/checkpoint/types/country.type";
import { Metadata } from "next";
import { JSX, Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: { invId: string };
}): Promise<Metadata> {
  const invId = params.invId;

  /**
   * -------------------------------------------------------------
   * Fetch minimal safe event context
   * -------------------------------------------------------------
   * IMPORTANT:
   * - Do NOT fetch guest name
   * - Do NOT fetch email
   * - Do NOT fetch seat / ticket
   */
  const invitation = await getSafeInvitationContext(invId);

  /**
   * Fallback (invalid / expired)
   */
  if (!invitation) {
    return buildMetadata({
      title: "Invitation",
      description: "This invitation is invalid or expired.",
      page: "rsvp-invitation",

      robots: {
        index: false,
        follow: false,
      },
    });
  }

  return buildMetadata({
    title: `RSVP • ${invitation.eventName}`,
    description: invitation.eventDescription ?? "Confirm your attendance for this event.",

    page: "rsvp-invitation",

    /**
     * CRITICAL:
     * Never index invitation pages
     */
    robots: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
    },

    /**
     * OpenGraph intentionally NON-personalized
     */
    openGraph: {
      title: `You're invited`,
      description: invitation.eventDescription ?? "Confirm your attendance.",
      image: invitation.ogImage,
    },
  });
}

/**
 * -------------------------------------------------------------
 * Safe Invitation Context Fetcher
 * -------------------------------------------------------------
 * MUST NOT expose personal data
 */
async function getSafeInvitationContext(invId: string) {
  // TODO: replace with real DB / GraphQL
  return {
    eventName: "Summer Gala 2026",
    eventDescription: "Exclusive VIP evening event.",
    ogImage: `/api/og?invId=${invId}`,
  };
}
/**
 * Main RSVP Page Entry
 * - Extracts invitationId from URL
 * - Delegates all logic/UI to <RsvpContainer />
 */
export default async function RsvpPage(): Promise<JSX.Element> {
  const client = await createServerClient();

  const res = await client.query<GetAllCallingCodesQuery, GetAllCallingCodesQueryVariables>({
    query: GetAllCallingCodesDocument,
    fetchPolicy: "cache-first",
  });

  const countries: CallingCodeCountry[] =
    res?.data?.getAllCountries.map((c) => ({
      iso2: c.iso2,
      name: c.name,
      flagSvg: c.flagSvg,
      callingCode: c.callingCode?.code ?? null,
    })) ?? [];

  return (
    <Suspense fallback={<RsvpLoading />}>
      <RsvpPageClient callingCodeCountry={countries} />
    </Suspense>
  );
}
