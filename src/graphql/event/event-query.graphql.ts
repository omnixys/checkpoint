import { gql } from "@apollo/client";

export const MY_EVENTS = gql`
    query MyEvents {
      myEvents {
        id
        name
        startsAt
        endsAt
        allowReEntry
        rotateSeconds
        maxSeats
        owner
        isActive
        createdAt
        updatedAt
        dressCode
        description
        myRole
        address {
          id
          eventId
          street
          city
          zip
          country
          latitude
          longitude
        }
        settings {
          id
          eventId
          data
        }
        theme {
          id
          eventId
          colors
          layout
          typography
        }
        media {
          id
          eventId
          kind
          url
          alt
          order
        }
        fullDescription {
          id
          eventId
          type
          order
          visible
          props
        }
        faqs {
          id
          eventId
          question
          answer
          order
        }
        team {
          id
          eventId
          name
          role
          imageUrl
          order
        }
        auditLogs {
          id
          eventId
          actorId
          action
          data
          createdAt
        }
        timeline {
          id
          eventId
          type
          timestamp
          label
        }
        userRoles {
          id
          eventId
          userId
          role
        }
      }
    }
`;

export const EVENT_BY_ID = gql`
  query Event($eventId: ID!) {
    event(id: $eventId) {
      id
      name
      startsAt
      endsAt
      maxSeats
      rotateSeconds
      allowReEntry
      dressCode
      description
      myRole
      createdAt
      updatedAt
      userRoles {
        id
        eventId
        userId
        role
      }
      timeline {
        id
        eventId
        type
        timestamp
        label
      }
      auditLogs {
        id
        eventId
        actorId
        action
        data
        createdAt
      }
      team {
        id
        eventId
        name
        role
        imageUrl
        order
      }
      faqs {
        id
        eventId
        question
        answer
        order
      }
      fullDescription {
        id
        eventId
        type
        order
        visible
        props
      }
      media {
        id
        eventId
        kind
        url
        alt
        order
      }
      theme {
        id
        eventId
        colors
        layout
        typography
      }
      settings {
        id
        eventId
        data
      }
      address {
        id
        eventId
        street
        city
        zip
        country
        latitude
        longitude
      }
      owner
      isActive
      myRole
    }
  }
`;

export const EVENT_BY_ID_2 = gql`
  query Event2($eventId: ID!) {
    event2(id: $eventId) {
      id
      name
      startsAt
      endsAt
      maxSeats
      rotateSeconds
      allowReEntry
      dressCode
      description
      myRole
      createdAt
      updatedAt
      userRoles {
        id
        eventId
        userId
        role
      }
      timeline {
        id
        eventId
        type
        timestamp
        label
      }
      auditLogs {
        id
        eventId
        actorId
        action
        data
        createdAt
      }
      team {
        id
        eventId
        name
        role
        imageUrl
        order
      }
      faqs {
        id
        eventId
        question
        answer
        order
      }
      fullDescription {
        id
        eventId
        type
        order
        visible
        props
      }
      media {
        id
        eventId
        kind
        url
        alt
        order
      }
      theme {
        id
        eventId
        colors
        layout
        typography
      }
      settings {
        id
        eventId
        data
      }
      address {
        id
        eventId
        street
        city
        zip
        country
        latitude
        longitude
      }
      owner
      isActive
      myRole
    }
  }
`;


export const MY_GUESTS_IDS = gql`
  query MyGuests($eventId: ID!) {
    myGuests(eventId: $eventId)
  }
`;
