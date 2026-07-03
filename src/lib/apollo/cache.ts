import { InMemoryCache, type TypePolicies } from "@apollo/client";

/**
 * Centralized Apollo cache configuration.
 *
 * Goals:
 * - Prevent duplicate entities
 * - Avoid unsafe array merges
 * - Ensure deterministic UI state
 * - Support real-time updates (Kafka + Subscriptions)
 */
const typePolicies: TypePolicies = {
  /**
   * ROOT QUERY CONFIGURATION
   */
  Query: {
    fields: {
      TicketPayload: {
        keyArgs: ["id"],
      },

      any: {
        keyArgs: ["id"],
      },

      InvitationPayload: {
        keyArgs: ["id"],
      },

      SeatPayload: {
        keyArgs: ["id"],
      },

      UserPayload: {
        keyArgs: ["id"],
      },

      /**
       * Seat layout (must be consistent)
       */
      seatLayout: {
        keyArgs: ["eventId"],
        merge: false,
      },

      /**
       * Current user's tickets
       *
       * CRITICAL:
       * - Must NOT merge (device-bound, security-sensitive)
       * - Always replace with fresh data
       */
      getMyTickets: {
        keyArgs: false,
        merge: false,
      },

      /**
       * Tickets by event
       */
      ticketsByEvent: {
        keyArgs: ["eventId"],
        merge: false,
      },

      /**
       * Single ticket
       */
      ticketById: {
        keyArgs: ["id"],
      },

      /**
       * Events (user-specific)
       */
      myEvents: {
        keyArgs: false,
        merge: false,
      },

      /**
       * Event tree (hierarchical)
       */
      eventTree: {
        keyArgs: ["id"],
        merge: false,
      },

      /**
       * Invitations for event
       */
      eventInvitations: {
        keyArgs: ["eventId"],
        merge: false,
      },

      /**
       * Users list
       */
      users: {
        keyArgs: false,
        merge: false,
      },
    },
  },

  /**
   * ENTITY CONFIGURATION
   */
  Ticket: {
    keyFields: ["id"],

    fields: {
      /**
       * Prevent Apollo from merging partial ticket updates incorrectly.
       */
      currentState: {
        merge: false,
      },
    },
  },

  Event: {
    keyFields: ["id"],
  },

  Invitation: {
    keyFields: ["id"],
  },

  Seat: {
    keyFields: ["id"],
  },

  User: {
    keyFields: ["id"],
  },
};

/**
 * Create Apollo cache instance
 */
export const apolloCache = new InMemoryCache({
  typePolicies,
});
