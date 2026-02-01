import { SectionData } from "../../app/description/components/event-description/section/section.types";

export const mockMinimalEvent: SectionData[] = [
  {
    id: "hero",
    type: "hero",
    order: 0,
    visible: true,
    props: {
      title: "Vision Nights",
      subtitle: "An evening of ideas.",
      backgroundImage:
        "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?q=80",
      overlayOpacity: 0.18,
    },
  },

  {
    id: "text",
    type: "text",
    order: 1,
    visible: true,
    props: {
      title: "",
      content: `
Ein minimalistisches Event für Menschen, die Klarheit und Fokus suchen.  
Ohne Ablenkung. Ohne Lärm. Nur Inspiration, Gespräche und Ideen.

Weniger ist mehr.
      `,
      align: "center",
    },
  },
];

export const randomEventTitles = [
  "Future Creators Festival",
  "Silent Mind Retreat",
  "Urban Style Expo",
  "Creative Coding Weekend",
  "NextGen Innovators Lab",
  "Luxury Black & White Gala",
  "Midnight Rooftop Experience",
  "Electric Summer Beats",
  "Nordic Winter Festival",
  "Open Air Film Night",
  "Digital Art Exhibition",
  "AI Research Demo Day",
  "Startup Pitch Arena",
  "TechWomen Leadership Forum",
  "Premium Whisky Tasting",
  "Jazz & Lights Night",
  "XR Immersion Day",
  "City Photography Walk",
  "Mindfulness & Focus Summit",
  "Ultra Minimal Gathering",
];

export const unsplashTech = [
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80",
  "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?q=80",
];

export const unsplashWedding = [
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80",
  "https://images.unsplash.com/photo-1530023367847-a683933f4172?q=80",
];

export const unsplashMinimal = [
  "https://images.unsplash.com/photo-1499084732479-de2c02d45fc4?q=80",
  "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80",
];

export const mockAIAutofill = {
  prompt: "Generate a hero subtitle for 'AI Summit 2025'",
  result: "Where intelligence becomes inspiration.",
};

export const mockPromptExamples = [
  {
    type: "hero",
    prompt: "Generate a hero subtitle for 'Future Creators Festival'",
    result: "Where ideas find their future.",
  },
  {
    type: "text",
    prompt: "Write a description for 'Vision Nights'",
    result:
      "A curated experience designed to spark clarity, creativity and meaningful connections.",
  },
];

export function generateRandomEvent(): SectionData[] {
  const title =
    randomEventTitles[Math.floor(Math.random() * randomEventTitles.length)];

  return [
    {
      id: "hero-" + crypto.randomUUID(),
      type: "hero",
      visible: true,
      order: 0,
      props: {
        title,
        subtitle: "An experience unlike any other.",
        backgroundImage: unsplashMinimal[0],
      },
    },
    {
      id: "text-" + crypto.randomUUID(),
      type: "text",
      visible: true,
      order: 1,
      props: {
        content: `Welcome to **${title}** — an event designed to inspire, connect and ignite ideas.`,
      },
    },
  ];
}

export const mockTeamMembers = [
  {
    name: "Ariana Wells",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80",
    bio: "Creates immersive experiences for luxury brand events.",
  },
  {
    name: "Dr. Malik Johnson",
    role: "AI Systems Lead",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80",
    bio: "Researches real-time agentic systems & human-AI interaction.",
  },
];
