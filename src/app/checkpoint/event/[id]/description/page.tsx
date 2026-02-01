"use client";

import AddSectionButton from "@/components/description/AddSectionButton";
import DndContextWrapper from "@/components/description/dnd/DndContextWrapper";
import SortableSection from "@/components/description/dnd/SortableSection";
import { EventRole } from "@/types/event/event-enum.type";
import { useEffect, useRef, useState } from "react";
// import EditorPanel from "@/components/../../components/description/editor/EditorPanel";
import SectionRenderer from "@/components/description/section/SectionRenderer";
import { useActiveEvent } from "@/providers/ActiveEventProvider";
import {
  EventDescriptionBlock,
  SectionType,
} from "@/types/event/event.type";

export default function EventDescriptionPage() {
  const { activeRole, activeEvent } = useActiveEvent();
  const isAdmin = activeRole === EventRole.ADMIN;

  const [sections, setSections] = useState<EventDescriptionBlock[]>(
    activeEvent?.fullDescription ?? []
  );

  const [editing, setEditing] = useState<EventDescriptionBlock | null>(null);
  const [liveProps, setLiveProps] = useState<
    EventDescriptionBlock["props"] | null
  >(null);

  const DEFAULT_PROPS: Record<SectionType, any> = {
    hero: {},
    text: {},
    gallery: { images: [] },
    features: { items: [] },
    timeline: { steps: [] },
    location: {},
    team: { members: [] },
    faq: { items: [] },
    quote: { quote: "" },
  };

  // undo/redo
  const undoStack = useRef<EventDescriptionBlock[][]>([]);
  const redoStack = useRef<EventDescriptionBlock[][]>([]);
  const autosaveTimer = useRef<NodeJS.Timeout | null>(null);

  const pushHistory = (current: EventDescriptionBlock[]) => {
    undoStack.current.push(JSON.parse(JSON.stringify(current)));
    redoStack.current = [];
  };

  const undo = () => {
    if (undoStack.current.length === 0) return;
    const previous = undoStack.current.pop()!;
    redoStack.current.push(JSON.parse(JSON.stringify(sections)));
    setSections(previous);
  };

  const redo = () => {
    if (redoStack.current.length === 0) return;
    const next = redoStack.current.pop()!;
    undoStack.current.push(JSON.parse(JSON.stringify(sections)));
    setSections(next);
  };

  // ctrl+z / ctrl+shift+z
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;

      if (mod && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (mod && e.shiftKey && e.key === "Z") {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [sections]);

  // EDIT
  const handleEdit = (id: string) => {
    const s = sections.find((x) => x.id === id);
    if (!s) return;
    setEditing(s);
    setLiveProps(s.props);
  };

  // LIVE CHANGE
  // const handleChangeLive = (newProps: EventDescriptionBlock["props"]) => {
  //   setLiveProps(newProps);

  //   const updated = sections.map((s) =>
  //     s.id === editing?.id ? { ...s, props: newProps } : s
  //   );

  //   setSections(updated);

  //   // Autosave
  //   if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
  //   autosaveTimer.current = setTimeout(() => {
  //     // saveSections(updated);
  //   }, 1500);
  // };

  // ADD
  const handleAdd = (type: SectionType) => {
    const newSection: EventDescriptionBlock = {
      id: "sec-" + crypto.randomUUID(),
      eventId: activeEvent?.id ?? "",
      type,
      visible: true,
      order: sections.length,
      props: DEFAULT_PROPS[type],
    };

    pushHistory(sections);

    const updated = [...sections, newSection];
    setSections(updated);

    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    // autosaveTimer.current = setTimeout(() => saveSections(updated), 1500);
  };

  // SAVE
  const handleSave = (props: any) => {
    const updated = sections.map((s) =>
      s.id === editing!.id ? { ...s, props } : s
    );

    setSections(updated);
    setEditing(null);
    setLiveProps(null);

    // saveSections(updated);
  };

  // REORDER
  const handleReorder = (ids: string[]) => {
    pushHistory(sections);

    const updated = ids.map((id, index) => {
      const original = sections.find((s) => s.id === id)!;
      return { ...original, order: index };
    });

    setSections(updated);

    // saveSections(updated);
  };

  // -------------------------------------------------------

  return (
    <>
      <DndContextWrapper sections={sections} onReorder={handleReorder}>
        {[...sections]
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((s) => (
            <SortableSection key={s.id} id={s.id}>
              <SectionRenderer
                sections={[
                  editing?.id === s.id ? applyLiveProps(s, liveProps) : s,
                ]}
                isAdmin={isAdmin}
                onEdit={handleEdit}
              />
            </SortableSection>
          ))}
      </DndContextWrapper>

      {isAdmin && <AddSectionButton onAdd={handleAdd} />}

      {/* {isAdmin && (
        <EditorPanel
          open={!!editing}
          sectionType={editing?.type}
          sectionProps={editing?.props}
          onClose={() => setEditing(null)}
          onSave={handleSave}
          onChangeLive={handleChangeLive}
        />
      )} */}
    </>
  );
}

function applyLiveProps<T extends EventDescriptionBlock>(
  section: T,
  liveProps: T["props"] | null
): T {
  if (!liveProps) return section;

  return {
    ...section,
    props: liveProps,
  };
}
