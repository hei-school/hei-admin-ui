import globalBg from "@/assets/announcements_bg.jpg";
import managerBg from "@/assets/manager_announcement_bg.jpg";
import studentBg from "@/assets/student_announcement_bg.jpg";
import teacherBg from "@/assets/teachers_announcement_bg.jpg";
import {PALETTE_COLORS} from "@/haTheme";
import {Scope} from "@haapi/typescript-client";

export const getBgImg = (scope: string) => {
  switch (scope) {
    case Scope.GLOBAL:
      return globalBg;
    case Scope.STUDENT:
      return studentBg;
    case Scope.TEACHER:
      return teacherBg;
    case Scope.MANAGER:
      return managerBg;
    default:
      return PALETTE_COLORS.black;
  }
};
