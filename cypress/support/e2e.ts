import "./commands";

Cypress.on("uncaught:exception", (err, _runnable) => {
  // FIXME: on the login when try to reset password
  if (err.message.includes("Cannot call an event handler while rendering.")) {
    return false;
  }
  return true;
});
