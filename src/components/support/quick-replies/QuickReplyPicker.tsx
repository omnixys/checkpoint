"use client";

interface QuickReplyPickerProps {
  onSelect: (body: string) => void;
}

export default function QuickReplyPicker({ onSelect: _onSelect }: QuickReplyPickerProps) {
  // Quick replies feature removed — backend no longer supports this
  return null;
}
