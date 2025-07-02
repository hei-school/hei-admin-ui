import {Group} from "@haapi/typescript-client";

const typeTranslations: {[key: string]: string} = {
  COURSE: "Cours",
  INTEGRATION: "Intégration",
  SEMINAR: "Séminaire",
  SUPPORT_SESSION: "Entraide",
  EXAM: "Examen",
  OTHERS: "Autres",
};

export const transformApiDataToCalendarEvents = (data: any) => {
  if (!Array.isArray(data)) {
    console.error("Attendu un tableau mais reçu :", data);
    return [];
  }

  return data
    .filter((event) => event != null)
    .map((event) => {
      const isCourse = event.type === "COURSE";
      const courseCode = isCourse && event.course ? event.course.code : "";
      const translatedType = typeTranslations[event.type] || event.type;
      const groupe = event.groups?.map((group: Group) => group.ref).join(", ");
      return {
        id: event.id,
        title: isCourse
          ? `[${groupe}] ${translatedType} (${courseCode}) - ${event.title}`
          : ` ${groupe ? `[${groupe}] ` : ""} ${translatedType} - ${event.title}` ||
            "Événement sans titre",
        start: event?.begin_datetime ? new Date(event.begin_datetime) : null,
        end: event?.end_datetime ? new Date(event.end_datetime) : null,
        description: event.description || "Pas de description",
        groupName: event.groups?.[0]?.name || "Pas de groupe",
        color: event.color,
      };
    });
};

if (typeof window !== "undefined") {
  (window as any).transformApiDataToCalendarEvents =
    transformApiDataToCalendarEvents;
}
