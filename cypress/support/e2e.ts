import "./commands";

Cypress.on("uncaught:exception", (err, _runnable) => {
  // FIXME: on the login when try to reset password
  if (err.message.includes("Cannot call an event handler while rendering.")) {
    return false;
  }
  return true;
});

Cypress.on("uncaught:exception", (err) => {
  return !err.message.includes(
    `Failed to execute 'define' on 'CustomElementRegistry': the name "awswaf-captcha" has already been used with this registry`
  );
});
