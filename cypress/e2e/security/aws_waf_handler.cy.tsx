import {heiAdmin} from "../utils";

describe("Aws waf handler", () => {
  specify(
    "display captcha dialog on x-amzn-waf-action: captcha & status: 405",
    () => {
      cy.login({
        role: "MANAGER",
      });

      cy.get('[href="/monitors"]').click();

      cy.intercept("GET", heiAdmin("/monitors*"), (req) => {
        req.reply({...req, statusCode: 405});
      });

      cy.window()
        .its("location")
        .should(({pathname}) => {
          expect(pathname).to.contains("human-verification");
        });
    }
  );
});
