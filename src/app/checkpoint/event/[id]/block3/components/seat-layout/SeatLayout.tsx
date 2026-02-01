import { LayoutActionsProvider } from "@/app/checkpoint/event/[id]/block3/components/edit/layoutActions2";
import CanvasStage from "./CanvasStage";

export default function SeatLayout({ layout }) {
  return (
    <LayoutActionsProvider>
      <CanvasStage sections={layout} />
    </LayoutActionsProvider>
  );
}
