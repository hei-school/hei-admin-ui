export const eventStyleGetter = (event: any) => {
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

if (typeof window !== "undefined") {
  (window as any).eventStyleGetter = eventStyleGetter;
}
