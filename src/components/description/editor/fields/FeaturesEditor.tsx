"use client";

import { useActiveEvent } from "@/components/../../providers/ActiveEventProvider";
import { Box, Button, Stack, TextField } from "@mui/material";
import { aiGenerate } from "../../ai/ai.service";
import AIButton from "../../ai/aiButton";
import { promptFeatures } from "../../ai/prompts";

export default function FeaturesEditor({ values, setValue }: any) {
  const { activeEvent } = useActiveEvent();

  const handleAI = async () => {
    const json = await aiGenerate(promptFeatures(activeEvent?.name || "Event"));
    try {
      setValue("items", JSON.parse(json));
    } catch {
      // fallback
      console.error("AI did not return valid JSON");
    }

    const add = () =>
      setValue("items", [
        ...(values.items || []),
        { icon: "", title: "", description: "" },
      ]);

    const update = (idx: number, key: string, value: any) => {
      const arr = [...(values.items || [])];
      arr[idx] = { ...arr[idx], [key]: value };
      setValue("items", arr);
    };

    const remove = (idx: number) => {
      const arr = [...(values.items || [])];
      arr.splice(idx, 1);
      setValue("items", arr);
    };

    return (
      <Box>
        <Button variant="outlined" onClick={add} sx={{ mb: 2 }}>
          Add Feature
        </Button>

        <AIButton label="✨ AI generate Hero Subtitle" onGenerate={handleAI} />

        <Stack spacing={3}>
          {(values.items || []).map((item: any, i: number) => (
            <Box key={i}>
              <TextField
                label="Icon"
                value={item.icon}
                fullWidth
                sx={{ mb: 1 }}
                onChange={(e) => update(i, "icon", e.target.value)}
              />
              <TextField
                label="Title"
                value={item.title}
                fullWidth
                sx={{ mb: 1 }}
                onChange={(e) => update(i, "title", e.target.value)}
              />
              <TextField
                label="Description"
                value={item.description}
                fullWidth
                onChange={(e) => update(i, "description", e.target.value)}
              />
              <Button color="error" sx={{ mt: 1 }} onClick={() => remove(i)}>
                Delete
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    );
  };
}
