export const trackNavClick = (itemKey, role) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "nav_click",
    menu_item: itemKey,
    user_role: role,
  });
};
