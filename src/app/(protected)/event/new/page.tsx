"use client";

import { CreateEventProvider } from "@/checkpoint/app/(protected)/event/new/context/CreateEventContext";
import CreateEventWizard from "@/checkpoint/app/(protected)/event/new/CreateEventWizard";

export default function CreateEventPage() {
  return (
    <CreateEventProvider>
      <CreateEventWizard />
    </CreateEventProvider>
  );
}
