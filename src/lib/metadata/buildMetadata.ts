import { Metadata } from "next";
import { AppMetadata } from "./types";
import { baseMetadata } from "@/checkpoint/lib/metadata/base.metadata";

/**
 * -------------------------------------------------------------
 * Metadata Builder
 * -------------------------------------------------------------
 * Central function to generate consistent metadata
 * across all pages.
 *
 * WHY:
 * - Avoid duplication
 * - Enforce consistency
 * - Enable analytics mapping via `page`
 * -------------------------------------------------------------
 */
export function buildMetadata(config: AppMetadata): Metadata {
  return {
    ...baseMetadata,

    title: config.title,
    description: config.description,

    keywords: config.keywords ?? baseMetadata.keywords,
    robots: config.robots ?? baseMetadata.robots,

    openGraph: config.disableOpenGraph
      ? undefined
      : {
          ...baseMetadata.openGraph,
          title: config.openGraph?.title ?? config.title,
          description: config.openGraph?.description ?? config.description,
          images: config.openGraph?.image
            ? [{ url: config.openGraph.image }]
            : baseMetadata.openGraph?.images,
        },

    other: {
      ...baseMetadata.other,
      "x-page": config.page,
    },
  };
}
