"use client";

import { useActiveEvent } from "@/components/../../providers/ActiveEventProvider";
import { Box, Slider, TextField } from "@mui/material";
import { aiGenerate } from "../../ai/ai.service";
import AIButton from "../../ai/aiButton";
import { promptHero } from "../../ai/prompts";

export default function HeroEditor({ values, setValue }: any) {
  const { activeEvent } = useActiveEvent();

  const handleAI = async () => {
    const subtitle = await aiGenerate(promptHero(activeEvent?.name || "Hero"));
    setValue("subtitle", subtitle);
  };
  return (
    <Box>
      <AIButton label="✨ AI generate Hero Subtitle" onGenerate={handleAI} />

      <TextField
        label="Title"
        value={values.title || ""}
        fullWidth
        onChange={(e) => setValue("title", e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Subtitle"
        value={values.subtitle || ""}
        fullWidth
        onChange={(e) => setValue("subtitle", e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Background Image URL"
        value={values.backgroundImage || ""}
        fullWidth
        onChange={(e) => setValue("backgroundImage", e.target.value)}
        sx={{ mb: 2 }}
      />

      <Slider
        value={values.overlayOpacity ?? 0.32}
        min={0}
        max={1}
        step={0.01}
        onChange={(_, v) => setValue("overlayOpacity", v)}
      />

      <TextField
        label="Height (px or %)"
        value={values.height || "82vh"}
        fullWidth
        onChange={(e) => setValue("height", e.target.value)}
        sx={{ mt: 2 }}
      />
    </Box>
  );
}
