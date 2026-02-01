"use client";

import React from "react";
import {
  Box,
  Stack,
  IconButton,
  useTheme,
  alpha,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
} from "@mui/material";

import TextFieldsIcon from "@mui/icons-material/TextFields";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export default function EventDescriptionEditor({ value, onChange }: Props) {
  const theme = useTheme();
  const [mode, setMode] = React.useState<"edit" | "preview">("edit");

  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [value]);

  const apply = (before: string, after = "") => {
    if (!textareaRef.current) return;

    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;

    const selected = value.slice(start, end);
    const updated =
      value.slice(0, start) + before + selected + after + value.slice(end);

    onChange(updated);

    setTimeout(() => {
      el.focus();
      el.selectionStart = el.selectionEnd =
        start + before.length + selected.length + after.length;
    }, 1);
  };

  return (
    <Stack spacing={2}>
      {/* Toolbar */}
      <Box
        sx={{
          borderRadius: 4,
          bgcolor: alpha(theme.palette.background.paper, 0.6),
          backdropFilter: "blur(14px)",
          px: 1,
          py: 0.8,
          display: "flex",
          gap: 0.5,
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: theme.shadows[3],
        }}
        component={motion.div}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => apply("**", "**")}>
            <FormatBoldIcon />
          </IconButton>

          <IconButton onClick={() => apply("_", "_")}>
            <FormatItalicIcon />
          </IconButton>

          <IconButton onClick={() => apply("<u>", "</u>")}>
            <FormatUnderlinedIcon />
          </IconButton>

          <IconButton onClick={() => apply("- ")} title="Bullet List">
            <FormatListBulletedIcon />
          </IconButton>

          <IconButton onClick={() => apply("1. ")} title="Numbered List">
            <FormatListNumberedIcon />
          </IconButton>

          <IconButton onClick={() => apply("### ")} title="Heading">
            <TextFieldsIcon />
          </IconButton>
        </Stack>

        <ToggleButtonGroup
          exclusive
          value={mode}
          onChange={(_, v) => v && setMode(v)}
          sx={{
            borderRadius: 3,
            bgcolor: alpha(theme.palette.background.paper, 0.5),
            backdropFilter: "blur(10px)",
          }}
        >
          <ToggleButton
            value="edit"
            sx={{
              fontWeight: 600,
              textTransform: "none",
              px: 1.6,
            }}
          >
            <EditIcon fontSize="small" /> Edit
          </ToggleButton>

          <ToggleButton
            value="preview"
            sx={{
              fontWeight: 600,
              textTransform: "none",
              px: 1.6,
            }}
          >
            <VisibilityIcon fontSize="small" /> Preview
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Editor / Preview */}
      {mode === "edit" ? (
        <Box
          sx={{
            borderRadius: 4,
            bgcolor: alpha(theme.palette.background.paper, 0.4),
            backdropFilter: "blur(20px)",
            p: 2,
            boxShadow: theme.shadows[2],
          }}
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Beschreibung eingeben…"
            style={{
              width: "100%",
              minHeight: "120px",
              fontSize: "1rem",
              fontFamily: theme.typography.fontFamily,
              border: "none",
              outline: "none",
              resize: "none",
              background: "transparent",
              color: theme.palette.text.primary,
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            borderRadius: 4,
            bgcolor: alpha(theme.palette.background.paper, 0.3),
            backdropFilter: "blur(20px)",
            p: 2,
            boxShadow: theme.shadows[3],
          }}
        >
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <Typography sx={{ mb: 1.5 }}>{children}</Typography>
              ),
              h1: ({ children }) => (
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {children}
                </Typography>
              ),
              h2: ({ children }) => (
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {children}
                </Typography>
              ),
              h3: ({ children }) => (
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {children}
                </Typography>
              ),
              li: ({ children }) => (
                <Typography component="li" sx={{ ml: 2 }}>
                  {children}
                </Typography>
              ),
            }}
          >
            {value || "*Keine Beschreibung vorhanden.*"}
          </ReactMarkdown>
        </Box>
      )}
    </Stack>
  );
}
