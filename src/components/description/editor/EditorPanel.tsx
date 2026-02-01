"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Divider } from "@mui/material";
import { EditorPanelProps } from "./editor.types";
import { editorSx } from "./editor.style";

import HeroEditor from "./fields/HeroEditor";
import TextEditor from "./fields/TextEditor";
import GalleryEditor from "./fields/GalleryEditor";
import FeaturesEditor from "./fields/FeaturesEditor";
import TimelineEditor from "./fields/TimelineEditor";
import LocationEditor from "./fields/LocationEditor";
import TeamEditor from "./fields/TeamEditor";
import FAQEditor from "./fields/FAQEditor";
import QuoteEditor from "./fields/QuoteEditor";

const Editors: Record<string, any> = {
  hero: HeroEditor,
  text: TextEditor,
  gallery: GalleryEditor,
  features: FeaturesEditor,
  timeline: TimelineEditor,
  location: LocationEditor,
  team: TeamEditor,
  faq: FAQEditor,
  quote: QuoteEditor,
};

export default function EditorPanel({
  open,
  sectionType,
  sectionProps,
  onClose,
  onSave,
  onChangeLive,
}: EditorPanelProps) {
  const [values, setValues] = useState<Record<string, any>>({});

  useEffect(() => {
    setValues(sectionProps ?? {});
  }, [sectionProps]);

  if (!sectionType) return null;

  const Editor = Editors[sectionType];

  const handleChange = (key: string, val: any) => {
    const newValues = { ...values, [key]: val };
    setValues(newValues);
    onChangeLive?.(newValues);
  };

  const handleSave = () => {
    onSave(values);
  };

  return (
    <Box sx={editorSx.root as any}>
      <Typography variant="h6" sx={editorSx.title}>
        Edit {sectionType}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Editor values={values} setValue={handleChange} />

      <Box sx={editorSx.footer}>
        <button onClick={onClose}>Cancel</button>
        <button onClick={handleSave}>Save</button>
      </Box>
    </Box>
  );
}
