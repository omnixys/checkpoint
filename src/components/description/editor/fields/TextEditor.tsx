"use client";

import { useActiveEvent } from "@/components/../../providers/ActiveEventProvider";
import { Box, TextField } from "@mui/material";
import { aiGenerate } from "../../ai/ai.service";
import AIButton from "../../ai/aiButton";
import { promptText } from "../../ai/prompts";

export default function TextEditor({ values, setValue }: any) {
  const { activeEvent } = useActiveEvent();

  return (
    <Box>
      <AIButton
        label="✨ Generate Description"
        onGenerate={async () => {
          const text = await aiGenerate(
            promptText(activeEvent?.name || "Text")
          );
          setValue("content", text);
        }}
      />

      <TextField
        label="Title"
        value={values.title || ""}
        fullWidth
        onChange={(e) => setValue("title", e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Content (Markdown)"
        value={values.content || ""}
        multiline
        rows={8}
        fullWidth
        onChange={(e) => setValue("content", e.target.value)}
      />

      <TextField
        label="Align"
        value={values.align || "left"}
        fullWidth
        onChange={(e) => setValue("align", e.target.value)}
        sx={{ mt: 2 }}
      />
    </Box>
  );
}
