import { EventPayload } from "@/checkpoint/generated/graphql";

/**
 * Hook stub for future reminder / push integration.
 * Will later connect to Notification Service.
 */
export function useEventReminder() {
  const scheduleReminder = (event: EventPayload, minutesBefore: number) => {
    // TODO: call notification service
    console.log("Schedule reminder", event.id, minutesBefore);
  };

  return { scheduleReminder };
}
