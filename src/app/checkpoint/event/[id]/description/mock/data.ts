import { SectionData } from "../../app/description/components/event-description/section/section.types";

export const mockEventDescriptionSections: SectionData[] = [
  {
    id: "hero-1",
    type: "hero",
    visible: true,
    order: 0,
    props: {
      title: "The Future Experience",
      subtitle:
        "Eine exklusive Nacht voller Vision, Technologie und Inspiration.",
      backgroundImage:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80",
      overlayOpacity: 0.32,
      height: "82vh",
    },
  },

  {
    id: "text-1",
    type: "text",
    visible: true,
    order: 1,
    props: {
      title: "Eine Nacht, die du nie vergessen wirst",
      content: `
Willkommen zu einem Erlebnis, das weit über klassische Events hinausgeht.  
Wir bringen Menschen zusammen, die Neues entdecken möchten – durch beeindruckende Visuals, Live-Performances und immersive Installationen.

Tauche ein in eine Welt, in der Technologie und Kreativität miteinander verschmelzen.
      `,
      align: "left",
    },
  },

  {
    id: "gallery-1",
    type: "gallery",
    visible: true,
    order: 2,
    props: {
      images: [
        "https://images.unsplash.com/photo-1503264116251-35a269479413?q=80",
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80",
        "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80",
      ],
      aspectRatio: "16:9",
    },
  },

  {
    id: "features-1",
    type: "features",
    visible: true,
    order: 3,
    props: {
      items: [
        {
          icon: "star",
          title: "Live Performance",
          description:
            "Erlebe internationale Artists in einer spektakulären Show.",
        },
        {
          icon: "bolt",
          title: "Immersive Technology",
          description:
            "Interaktive Installationen, AR-Momente und visuelle Highlights.",
        },
        {
          icon: "groups",
          title: "Community",
          description:
            "Treffe visionäre Menschen aus Design, Tech, Kunst & Business.",
        },
      ],
    },
  },

  {
    id: "timeline-1",
    type: "timeline",
    visible: true,
    order: 4,
    props: {
      steps: [
        {
          time: "18:00",
          title: "Einlass & Welcome Lounge",
          description:
            "Soft Drinks, Networking, Ambient Sound & Lichtinstallation.",
        },
        {
          time: "19:30",
          title: "Keynote – The Future Experience",
          description:
            "Inspirierende Opening-Session über Kreativität & Technologie.",
        },
        {
          time: "20:30",
          title: "Main Show",
          description:
            "Live Performance, audiovisuelles Immersive-Set, Spezialeffekte.",
        },
        {
          time: "22:00",
          title: "After Lounge",
          description:
            "Chill Vibes, Drinks, Networking und Interaktionen mit Künstlern.",
        },
      ],
    },
  },

  {
    id: "location-1",
    type: "location",
    visible: true,
    order: 5,
    props: {
      title: "Location",
      address: "Kulturhalle Zenith, Lilienthalallee 29, 80939 München",
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80",
      mapEmbedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2659.612738819293!2d11.60563877689796!3d48.19481254717399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479e74691f342d5b%3A0x5cc6171b5c3206ea!2sZenith%20M%C3%BCnchen!5e0!3m2!1sde!2sde!4v1765010410896!5m2!1sde!2sde",
    },
  },

  {
    id: "team-1",
    type: "team",
    visible: true,
    order: 6,
    props: {
      members: [
        {
          name: "Sophia Kramer",
          role: "Creative Director",
          image:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80",
          bio: "Expertin für immersive Experiences & audiovisuelle Kunst.",
        },
        {
          name: "Luca Benetti",
          role: "Lead Producer",
          image:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80",
          bio: "Verantwortlich für Showproduktion & internationale Künstler.",
        },
        {
          name: "Amina Watanabe",
          role: "Experience Designer",
          image:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80",
          bio: "Gestaltet Interaktion & Atmosphären, die unvergesslich bleiben.",
        },
      ],
    },
  },

  {
    id: "faq-1",
    type: "faq",
    visible: true,
    order: 7,
    props: {
      items: [
        {
          question: "Gibt es eine Abendkasse?",
          answer:
            "Ja, jedoch empfehlen wir Tickets im Voraus zu buchen – die Kapazität ist begrenzt.",
        },
        {
          question: "Gibt es eine Altersbeschränkung?",
          answer: "Empfohlen ab 16 Jahren. Minderjährige benötigen Begleitung.",
        },
        {
          question: "Ist die Location barrierefrei?",
          answer: "Ja, alle Bereiche sind vollständig barrierefrei zugänglich.",
        },
      ],
    },
  },

  {
    id: "quote-1",
    type: "quote",
    visible: true,
    order: 8,
    props: {
      quote: "“Innovation entsteht dort, wo Technologie auf Emotion trifft.”",
      author: "The Future Experience Team",
    },
  },
];

export const mockSimpleDescription = [
  {
    id: "hero",
    type: "hero",
    order: 0,
    visible: true,
    props: {
      title: "Mock Event",
      subtitle: "This is a mock subtitle.",
      backgroundImage: "https://picsum.photos/1200/800",
    },
  },
  {
    id: "text",
    type: "text",
    order: 1,
    visible: true,
    props: {
      title: "About this event",
      content: "This is a very simple mock text block.",
    },
  },
];
