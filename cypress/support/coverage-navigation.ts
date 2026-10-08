/** Répond 404 à toute requête XHR/fetch non interceptée : aucun appel réseau réel. */
export const mockUnhandledRequests = () => {
  cy.intercept({resourceType: /xhr|fetch/}, {statusCode: 404, body: {}});
};

/**
 * Change l'URL côté client (react-router BrowserRouter) une fois l'application
 * chargée, sans la recharger : un seul chargement de page par test.
 */
export const pushPathInApp = (path: string) => {
  cy.getByTestid("main-content").should("exist");
  cy.window().then((win) => {
    win.history.pushState({}, "", path);
    win.dispatchEvent(new win.PopStateEvent("popstate", {state: {}}));
  });
};

export const navigateInApp = (path: string) => {
  pushPathInApp(path);
  cy.routePathnameEq(path);
};
