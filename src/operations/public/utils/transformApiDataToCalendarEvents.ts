import {Group} from "@haapi-b0fc7615/typescript-client";

const typeTranslations: Record<string, string> = {
  COURSE: "Cours",
  INTEGRATION: "Intégration",
  SEMINAR: "Séminaire",
  SUPPORT_SESSION: "Entraide",
  EXAM: "Examen",
  OTHER: "Autres",
};

export const transformApiDataToCalendarEvents = (data: unknown) => {
  if (!Array.isArray(data)) {
    console.error("Expected an array but received:", data);
    return [];
  }

  return data
    .filter((event): event is NonNullable<typeof event> => event != null)
    .map((event) => {
      const isCourse = event.type === "COURSE";
      const courseCode = isCourse && event.course ? event.course.code : "";
      const translatedType = typeTranslations[event.type] || event.type;
      const groupList = event.groups
        ?.map((group: Group) => group.ref)
        .join(", ");

      let title: string;
      if (isCourse) {
        title = `[${groupList}] ${translatedType} (${courseCode}) - ${event.title}`;
      } else {
        const groupPrefix = groupList ? `[${groupList}] ` : "";
        title = `${groupPrefix}${translatedType} - ${event.title}`;
      }

      return {
        id: event.id,
        title: title || "Événement sans titre",
        start: event.begin_datetime ? new Date(event.begin_datetime) : null,
        end: event.end_datetime ? new Date(event.end_datetime) : null,
        description: event.description || "Pas de description",
        groupName: event.groups?.[0]?.name || "Pas de groupe",
        color: event.color,
      };
    });
};

// Optional: Export to window if needed (e.g., for debugging)
if (typeof window !== "undefined") {
  (window as any).transformApiDataToCalendarEvents =
    transformApiDataToCalendarEvents;
}
