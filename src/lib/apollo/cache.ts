import { InMemoryCache, type TypePolicies } from "@apollo/client";

const typePolicies: TypePolicies = {
  Query: {
    fields: {
      seatLayout: {
        keyArgs: ["eventId"],
        merge: false,
      },

      getMyTickets: {
        keyArgs: false,
        merge: false,
      },

      ticketsByEvent: {
        keyArgs: ["eventId"],
        merge: false,
      },

      ticketById: {
        keyArgs: ["id"],
      },

      myEvents: {
        keyArgs: false,
        merge: false,
      },

      eventTree: {
        keyArgs: ["id"],
        merge: false,
      },

      eventInvitations: {
        keyArgs: ["eventId"],
        merge: false,
      },

      users: {
        keyArgs: false,
        merge: false,
      },

      event: {
        keyArgs: ["id"],
        merge(existing, incoming, { mergeObjects }) {
          return mergeObjects(existing, incoming);
        },
      },
    },
  },

  EventPayload: {
    keyFields: ["id"],
    fields: {
      userRoles: {
        merge: false,
      },
      timeline: {
        merge: false,
      },
      settings: {
        merge: true,
      },
    },
  },

  SettingsPayload: {
    keyFields: ["id"],
    fields: {
      seatColorGroups: {
        merge: false,
      },
    },
  },

  SeatColorGroupPayload: {
    keyFields: ["id"],
  },

  SeatColorGroupStyle: {
    keyFields: false,
  },

  EventTimelinePayload: {
    keyFields: ["id"],
  },

  UserRolePayload: {
    keyFields: false,
  },

  MediaPayload: {
    keyFields: false,
    fields: {
      variants: {
        merge: false,
      },
    },
  },

  MediaVariantPayload: {
    keyFields: false,
  },

  InvitationPayload: {
    keyFields: ["id"],
    fields: {
      phoneNumbers: {
        merge: false,
      },
      plusOnes: {
        merge: false,
      },
    },
  },

  Invitation: {
    keyFields: ["id"],
  },

  SeatPayload: {
    keyFields: ["id"],
  },

  SectionPayload: {
    keyFields: ["id"],
    fields: {
      tables: {
        merge: false,
      },
      seats: {
        merge: false,
      },
    },
  },

  TablePayload: {
    keyFields: ["id"],
    fields: {
      seats: {
        merge: false,
      },
    },
  },

  TicketPayload: {
    keyFields: ["id"],
  },

  PhoneNumberPayload: {
    keyFields: false,
  },

  Seat: {
    keyFields: ["id"],
  },

  UserPayload: {
    keyFields: ["id"],
  },

  User: {
    keyFields: ["id"],
  },
};

export const apolloCache = new InMemoryCache({
  typePolicies,
});
