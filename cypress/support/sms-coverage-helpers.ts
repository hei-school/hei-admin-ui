export const mockSmsCoverageSideEffects = () => {
  cy.intercept({resourceType: /xhr|fetch/}, {statusCode: 404, body: {}});
  cy.intercept("GET", "/fees?page=*&page_size=500", {data: []});
  cy.intercept("GET", "/students/credit-payments*", []);
  cy.intercept("GET", "/retake_exams*", []);
};

/**
 * Navigue côté client (react-router BrowserRouter) sans recharger
 * l'application instrumentée : un seul chargement de page par test.
 */
export const navigateInApp = (path: string) => {
  cy.getByTestid("sms-menu").should("exist");
  cy.window().then((win) => {
    win.history.pushState({}, "", path);
    win.dispatchEvent(new win.PopStateEvent("popstate", {state: {}}));
  });
  cy.routePathnameEq(path);
};
