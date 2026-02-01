import type { Event } from "@/types/event/event.type";

/**
 * Hook stub for future reminder / push integration.
 * Will later connect to Notification Service.
 */
export function useEventReminder() {
  const scheduleReminder = (event: Event, minutesBefore: number) => {
    // TODO: call notification service
    console.log("Schedule reminder", event.id, minutesBefore);
  };

  return { scheduleReminder };
}




// import type { Event } from "@/types/event/event.type";
// import { useMutation } from "@apollo/client/react";
// import { SCHEDULE_EVENT_REMINDER } from "@/graphql/notification/reminder.mutation";

// type ScheduleReminderVars = {
//   eventId: string;
//   minutesBefore: number;
// };

// export function useEventReminder() {
//   const [schedule] = useMutation<void, ScheduleReminderVars>(
//     SCHEDULE_EVENT_REMINDER
//   );

//   const scheduleReminder = async (event: Event, minutesBefore: number) => {
//     await schedule({
//       variables: {
//         eventId: event.id,
//         minutesBefore,
//       },
//     });
//   };

//   return { scheduleReminder };
// }
