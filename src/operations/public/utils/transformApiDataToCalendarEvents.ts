export const transformApiDataToCalendarEvents = (data: any) => {
  if (!Array.isArray(data)) {
    console.error("Expected an array but got:", data);
    return [];
  }

  return data
    .filter((event) => event != null)
    .map((event) => ({
      id: event.id,
      title: `${event.type} - ${event.title}` || "Untitled Event",
      start: event?.begin_datetime ? new Date(event.begin_datetime) : null,
      end: event?.end_datetime ? new Date(event.end_datetime) : null,
      description: event.description || "Pas de description",
      groupName: event.groups?.[0]?.name || "Pas de groupe",
      color: event.color,
    }));
};
