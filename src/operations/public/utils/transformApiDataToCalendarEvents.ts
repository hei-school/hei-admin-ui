import {hexToRgba} from "@/operations/common/components/hexToRgba";
import {EventTitle} from "@/operations/events/utils";
import {Event} from "@haapi-b0fc7615/typescript-client";

export const transformApiDataToCalendarEvents = (data: Event[]) => {
  if (!Array.isArray(data)) {
    console.error("Expected an array but received:", data);
    return [];
  }

  return data
    .filter((event): event is NonNullable<typeof event> => event != null)
    .map((event) => {
      const baseTitle = EventTitle({event});
      return {
        id: event.id,
        title: baseTitle,
        start: event.begin_datetime ? new Date(event.begin_datetime) : null,
        end: event.end_datetime ? new Date(event.end_datetime) : null,
        description: event.description || "Pas de description",
        groupName: event.groups?.[0]?.name || "Pas de groupe",
        color: event.is_online
          ? `repeating-linear-gradient(
               45deg,
               ${event.color},
               ${event.color} 12px,
               ${hexToRgba(event.color!, 0.8)} 12px,
               ${hexToRgba(event.color!, 0.8)} 24px
             )`
          : event.color,
        isOnline: event.is_online,
      };
    });
};

// Optional: Export to window if needed (e.g., for debugging)
if (typeof window !== "undefined") {
  (window as any).transformApiDataToCalendarEvents =
    transformApiDataToCalendarEvents;
}
