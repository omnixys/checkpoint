import { SectionData } from "../../app/description/components/event-description/section/section.types";

export const mockTechEvent: SectionData[] = [
  {
    id: "hero",
    type: "hero",
    order: 0,
    visible: true,
    props: {
      title: "AI Summit 2025",
      subtitle: "Where the next generation of intelligence is born.",
      backgroundImage:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80",
      overlayOpacity: 0.3,
      height: "82vh",
    },
  },

  {
    id: "text",
    type: "text",
    order: 1,
    visible: true,
    props: {
      title: "The future begins here.",
      content: `
Welcome to **AI Summit 2025** — the global forum for innovators, engineers, designers and visionaries.

Erlebe Keynotes führender Tech-Unternehmen, zukunftsweisende live Demos und tiefgreifende Erkenntnisse über die nächsten Generationen von Machine Intelligence.

**Themes 2025:**  
- Real-Time Multimodal AI  
- Autonomous Systems  
- Vision Pro / XR Integration  
- Ethical AI & Governance  
- Neural-Interface Experiments  

The future is not coming — it’s here.
      `,
      align: "left",
    },
  },

  {
    id: "gallery",
    type: "gallery",
    order: 2,
    visible: true,
    props: {
      images: [
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80",
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80",
        "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80",
      ],
      aspectRatio: "16:9",
    },
  },

  {
    id: "features",
    type: "features",
    order: 3,
    visible: true,
    props: {
      items: [
        {
          icon: "memory",
          title: "Live Neural Demos",
          description:
            "Watch next-gen neural interfaces interact in real time.",
        },
        {
          icon: "visibility",
          title: "Vision Pro Lab",
          description:
            "Try immersive AR workspaces enhanced with AI-driven context.",
        },
        {
          icon: "bolt",
          title: "Real-Time AI",
          description: "Lightning-fast inference, agents & reasoning engines.",
        },
      ],
    },
  },

  {
    id: "timeline",
    type: "timeline",
    order: 4,
    visible: true,
    props: {
      steps: [
        {
          time: "09:00",
          title: "Registration & Breakfast",
          description: "Tech-lounge & early networking.",
        },
        {
          time: "10:00",
          title: "Opening Keynote · Future of AI",
          description: "Presented by leading researchers.",
        },
        {
          time: "12:00",
          title: "Live Demos & Expo Hall",
          description: "Hands-on labs, robotics & Vision Pro demos.",
        },
        {
          time: "17:00",
          title: "AI Ethics Roundtable",
          description: "Discussion about safety & regulations.",
        },
        {
          time: "19:00",
          title: "Networking Night",
          description: "Drinks, music & VIP lounge.",
        },
      ],
    },
  },

  {
    id: "location",
    type: "location",
    order: 5,
    visible: true,
    props: {
      title: "Location",
      address: "TechHall Convention Center, Berlin",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80",
      mapEmbedUrl: "https://www.google.com/maps/embed?...AI-Summit",
    },
  },

  {
    id: "team",
    type: "team",
    order: 6,
    visible: true,
    props: {
      members: [
        {
          name: "Dr. Lea Andersen",
          role: "AI Research Lead",
          image:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80",
          bio: "Specialist for AGI structures & autonomous agents.",
        },
        {
          name: "Takehiro Watanabe",
          role: "XR System Architect",
          image:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80",
          bio: "Creator of immersive workflows for Vision Pro.",
        },
      ],
    },
  },

  {
    id: "faq",
    type: "faq",
    order: 7,
    visible: true,
    props: {
      items: [
        {
          question: "Do I need programming knowledge?",
          answer: "No — all sessions are beginner-friendly.",
        },
        {
          question: "Is the event hybrid?",
          answer: "Yes, you can attend on-site or online.",
        },
      ],
    },
  },

  {
    id: "quote",
    type: "quote",
    order: 8,
    visible: true,
    props: {
      quote: "“AI will not replace humans — but humans using AI will.”",
      author: "AI Summit Team",
    },
  },
];
