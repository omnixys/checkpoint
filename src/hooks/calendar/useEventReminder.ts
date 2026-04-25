/**
 * Hook stub for future reminder / push integration.
 * Will later connect to Notification Service.
 */
export function useEventReminder() {
  const scheduleReminder = (event: any, minutesBefore: number) => {
    // TODO: call notification service
    console.log("Schedule reminder", event.id, minutesBefore);
  };

  return { scheduleReminder };
}
