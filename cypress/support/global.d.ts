import {WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import {UserConnected} from "../fixtures/api_mocks/authentification-mocks";

export type LoginConfig = Partial<UserConnected> & {
  role: WhoamiRoleEnum;
  success?: boolean;
};

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      login(options: LoginConfig): Chainable;
      mockLogin(options: LoginConfig): Chainable;
      getByTestid<E = JQuery<HTMLElement>>(testid: string): Chainable<E>;
      routePathnameEq(to: string): Chainable;
      attachFileToDropZone(
        filePath: string,
        options?: Partial<FileProcessingOptions>
      ): Chainable<Subject>;
      inteceptMockByOne<T extends {id: string}>(
        resource: string,
        mocks: T[]
      ): void;
      assertRequestBody<T>(
        requestAlias: string,
        expectedBody: (body: unknown) => T
      ): void;
    }
  }
}
