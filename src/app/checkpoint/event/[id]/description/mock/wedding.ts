import { SectionData } from "../../app/description/components/event-description/section/section.types";

export const mockWeddingEvent: SectionData[] = [
  {
    id: "hero",
    type: "hero",
    order: 0,
    visible: true,
    props: {
      title: "Joyce & Caleb",
      subtitle: "Für immer beginnt hier.",
      backgroundImage:
        "https://images.unsplash.com/photo-1522673607200-164d2d1f3a0c?q=80",
      overlayOpacity: 0.25,
    },
  },

  {
    id: "text",
    type: "text",
    order: 1,
    visible: true,
    props: {
      title: "Unsere Geschichte",
      content: `
Es begann mit einem Blick — und wurde zu einer Reise voller Vertrauen,
Freundschaft, Geduld und Liebe.

Wir freuen uns darauf, diesen besonderen Moment mit euch zu teilen.
      `,
    },
  },

  {
    id: "gallery",
    type: "gallery",
    order: 2,
    visible: true,
    props: {
      images: [
        "https://images.unsplash.com/photo-1529634806980-4e3a27405ad1?q=80",
        "https://images.unsplash.com/photo-1522673607797-8fa3f62f980b?q=80",
        "https://images.unsplash.com/photo-1487412720507-1c66f9c81b47?q=80",
      ],
      aspectRatio: "3:4",
    },
  },

  {
    id: "timeline",
    type: "timeline",
    order: 4,
    visible: true,
    props: {
      steps: [
        { time: "14:00", title: "Trauung", description: "Kirche St. Stephan." },
        {
          time: "15:30",
          title: "Sektempfang",
          description: "Garten & Terrasse.",
        },
        { time: "17:30", title: "Dinner", description: "Hausgemachte Küche." },
        {
          time: "20:00",
          title: "Eröffnungstanz",
          description: "Überraschung.",
        },
        { time: "22:00", title: "Party", description: "DJ & Open Bar." },
      ],
    },
  },

  {
    id: "quote",
    type: "quote",
    order: 10,
    visible: true,
    props: {
      quote: "“Love is the beginning of everything beautiful.”",
      author: "Joyce & Caleb",
    },
  },
];
