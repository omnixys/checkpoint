import { SectionData } from "../../app/description/components/event-description/section/section.types";

export const mockVipGalaEvent: SectionData[] = [
  {
    id: "hero",
    type: "hero",
    order: 0,
    visible: true,
    props: {
      title: "The Night of Excellence",
      subtitle: "A black-tie celebration of creativity and impact.",
      backgroundImage:
        "https://images.unsplash.com/photo-1515165562835-c3b8fa5ab6d0?q=80",
      overlayOpacity: 0.4,
      height: "90vh",
    },
  },

  {
    id: "text",
    type: "text",
    order: 1,
    visible: true,
    props: {
      title: "Eine Nacht voller Glanz",
      content: `
Willkommen zur exklusivsten Gala des Jahres — eine Nacht, die Eleganz feiert,
gemeinsam mit Persönlichkeiten aus Kultur, Wirtschaft und Wissenschaft.

Ein Abend in Schwarz-Gold.  
Ein Abend voller Kunst, Musik und Inspiration.  
Ein Abend, den man nie vergisst.
      `,
    },
  },

  {
    id: "features",
    type: "features",
    order: 2,
    visible: true,
    props: {
      items: [
        {
          icon: "diamond",
          title: "Red Carpet",
          description: "Luxuriöser Empfang wie bei internationalen Premieren.",
        },
        {
          icon: "restaurant",
          title: "Fine Dining",
          description: "Ein 5-Gänge-Menü der Extraklasse.",
        },
        {
          icon: "music_note",
          title: "Live Orchestra",
          description: "Symphonische Begleitung durch den Abend.",
        },
      ],
    },
  },
];
