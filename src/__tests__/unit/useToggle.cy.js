import {mount} from "@cypress/react";
import {useToggle} from "../../hooks/useToggle";
import {findByTestid} from "../utils";
import specTitle from "cypress-sonarqube-reporter/specTitle";

describe(specTitle("useToggle"), () => {
  const TOGGLE_BTN = "togglev()";
  const TRUE_BTN = "truev()";
  const FALSE_BTN = "falsev()";

  function Component() {
    const [v, set, toggle] = useToggle();
    return (
      <div>
        <button onClick={() => set(true)} data-testid={TRUE_BTN}>
          to true
        </button>
        <button onClick={() => set(true)} data-testid={FALSE_BTN}>
          to false
        </button>
        <button onClick={toggle} data-testid={TOGGLE_BTN}>
          to false
        </button>
        {v ? "true" : "false"};
      </div>
    );
  }

  mount(<Component />);

  cy.contains("false"); // 'false' by default

  findByTestid(TOGGLE_BTN).click();
  cy.contains("true");

  findByTestid(TOGGLE_BTN).click();
  cy.contains("false");

  findByTestid(TRUE_BTN).click();
  cy.contains("true");

  findByTestid(FALSE_BTN).click();
  cy.contains("false");
});
