/**
 * Hook stub for future reminder / push integration.
 * Will later connect to Notification Service.
 */
export function useEventReminder() {
  const scheduleReminder = (_event: any, _minutesBefore: number) => {};

  return { scheduleReminder };
}
