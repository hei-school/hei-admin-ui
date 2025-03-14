import logoBlue from "@/assets/logo-blue.jpg";
import logo from "@/assets/logo.jpg";
import {PALETTE_COLORS} from "@/haTheme";
import {Scope} from "@haapi/typescript-client";

export const getBgImg = (scope: string) => {
  switch (scope) {
    case Scope.GLOBAL:
      return logoBlue;
    case Scope.STUDENT:
      return logo;
    case Scope.TEACHER:
      return logo;
    case Scope.MANAGER:
      return logo;
    default:
      return PALETTE_COLORS.black;
  }
};
