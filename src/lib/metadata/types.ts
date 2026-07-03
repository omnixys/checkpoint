/**
 * -------------------------------------------------------------
 * Metadata Types
 * Central contract for all page metadata definitions
 * -------------------------------------------------------------
 */

export interface AppMetadata {
  title: string;
  description: string;

  /**
   * Logical page identifier (used for analytics, logging, tracking)
   */
  page: string;

  /**
   * Optional SEO keywords
   */
  keywords?: string[];

  /**
   * Optional robots control
   */
  robots?: {
    index?: boolean;
    follow?: boolean;
    noarchive?: boolean;
    nosnippet?: boolean;
  };

  /**
   * Optional OpenGraph overrides
   */
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
  };
  disableOpenGraph?: boolean;
}
