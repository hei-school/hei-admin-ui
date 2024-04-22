import {WhoamiRoleEnum} from "@haapi/typescript-client";
import {UserConnected} from "../fixtures/authentification-mocks";

export type LoginConfig = Partial<UserConnected> & {
  role: WhoamiRoleEnum;
  success?: boolean;
};

export declare global {
  namespace Cypress {
    interface Chainable {
      login(options: LoginConfig): Chainable;
      getByTestid<Subject>(testid: string): Chainable<Subject>;
      routePathnameEq(to: string): Chainable;
    }
  }
}
