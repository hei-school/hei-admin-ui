import {Event} from "@haapi-3d601c85/typescript-client";

export const eventStyleGetter = (event: Pick<Event, "is_online" | "color">) => {
  const style = {
    background: event.is_online ? "#000000" : event.color || "defaultColor",
    borderRadius: "10px",
    border: "2px solid white",
    fontWeight: "bold",
    color: "white",
  };

  return {
    style,
  };
};

declare global {
  interface Window {
    eventStyleGetter?: typeof eventStyleGetter;
  }
}

if (typeof window !== "undefined") {
  window.eventStyleGetter = eventStyleGetter;
}
