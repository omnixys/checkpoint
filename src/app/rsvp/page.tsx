"use server";

import { Suspense, JSX } from "react";
import RsvpClient from "./RsvpClient";
import RsvpLoading from "./loading";
import { createServerClient } from "@/checkpoint/lib/apollo/server-client";
import {
  GetAllCallingCodesDocument,
  GetAllCallingCodesQuery,
  GetAllCallingCodesQueryVariables,
} from "@/checkpoint/generated/graphql";
import { CallingCodeCountry } from "@/checkpoint/types/country.type";
import { buildMetadata } from "@/checkpoint/lib/metadata/buildMetadata";
import { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { eventId?: string };
}): Promise<Metadata> {
  const eventId = searchParams?.eventId;

  /**
   * -------------------------------------------------------------
   * Fallback (no eventId)
   * -------------------------------------------------------------
   */
  if (!eventId) {
    return buildMetadata({
      title: "RSVP",
      description: "Confirm your participation.",
      page: "rsvp",

      robots: {
        index: false,
        follow: false,
      },
    });
  }

  /**
   * -------------------------------------------------------------
   * Fetch Event Data (SSR)
   * -------------------------------------------------------------
   * Replace with:
   * - GraphQL call
   * - Prisma
   * - or internal API
   */
  const event = await getEventMetadata(eventId);

  /**
   * Security fallback (invalid event)
   */
  if (!event) {
    return buildMetadata({
      title: "RSVP",
      description: "Event not found.",
      page: "rsvp",

      robots: {
        index: false,
        follow: false,
      },
    });
  }

  return buildMetadata({
    title: `RSVP • ${event.name}`,
    description: event.description ?? `Confirm your attendance for ${event.name}.`,

    page: "rsvp",

    /**
     * RSVP pages should usually NOT be indexed
     */
    robots: {
      index: false,
      follow: false,
    },

    /**
     * OpenGraph → CRITICAL for sharing
     */
    openGraph: {
      title: `You're invited: ${event.name}`,
      description: event.description ?? "Confirm your attendance now.",
      image: event.ogImage,
    },
  });
}

/**
 * -------------------------------------------------------------
 * Dummy Event Fetcher (replace with real impl)
 * -------------------------------------------------------------
 */
async function getEventMetadata(eventId: string) {
  // TODO: replace with real data source
  return {
    name: "Summer Gala 2026",
    description: "Exclusive evening event with VIP access.",
    ogImage: `/api/og?eventId=${eventId}`,
  };
}

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
      <RsvpClient callingCodeCountry={countries} />
    </Suspense>
  );
}
