import "@cypress/code-coverage/support";
import "./commands";

beforeEach(() => {
  cy.intercept(
    {url: /.*captcha-sdk\.awswaf\.com.*/},
    {
      statusCode: 200,
      headers: {"content-type": "application/javascript"},
      body: `
        window.AwsWafCaptcha = window.AwsWafCaptcha || {
          renderCaptcha: function (container) {
            if (!container) return;
            var el = document.createElement("div");
            el.setAttribute("data-testid", "aws-waf-captcha-stub");
            el.style.width = "100%";
            el.style.height = "60px";
            container.appendChild(el);
          }
        };
        window.AwsWafIntegration = window.AwsWafIntegration || {
          getToken: function () { return Promise.resolve("test-waf-token"); }
        };
      `,
    }
  ).as("awsWafCaptchaScript");
});

Cypress.on("uncaught:exception", (err, _runnable) => {
  if (err.message.includes("Cannot call an event handler while rendering.")) {
    return false;
  }

  if (err.message.includes(`awswaf-captcha`)) {
    return false;
  }

  return true;
});

Cypress.on("uncaught:exception", (err) => {
  return !err.message.includes(
    `Failed to execute 'define' on 'CustomElementRegistry': the name "awswaf-captcha" has already been used with this registry`
  );
});
