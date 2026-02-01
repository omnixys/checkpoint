import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableSection({ id, children }: any) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {/* Drag Handle Wrapper */}
      <div
        {...attributes}
        {...listeners}
        style={{
          width: "24px",
          height: "24px",
          cursor: "grab",
          opacity: 0.5,
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 99,
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Notion-style six-dot icon */}
        <span style={{ fontSize: 22, userSelect: "none" }}>⋮⋮</span>
      </div>

      {children}
    </div>
  );
}
