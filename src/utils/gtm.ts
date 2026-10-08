declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export const trackNavClick = (itemKey: string, role: string | null) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "nav_click",
    menu_item: itemKey,
    user_role: role,
  });
};
