"use client";

interface QuickReplyManagerProps {
  open: boolean;
  onClose: () => void;
}

export default function QuickReplyManager({
  open: _open,
  onClose: _onClose,
}: QuickReplyManagerProps) {
  // Quick replies feature removed — backend no longer supports this
  return null;
}
