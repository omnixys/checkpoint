"use client";

import CreateEventWizard from "@/checkpoint/app/(protected)/event/new/CreateEventWizard";
import { CreateEventProvider } from "@/checkpoint/app/(protected)/event/new/context/CreateEventContext";

export default function CreateEventPage() {
  return (
    <CreateEventProvider>
      <CreateEventWizard />
    </CreateEventProvider>
  );
}
