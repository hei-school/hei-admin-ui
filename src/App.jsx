/* eslint-disable no-undef */
import {mainTheme} from "@/haTheme";
import announcements from "@/operations/announcements";
import cor from "@/operations/cor/index.ts";
import course from "@/operations/course";
import CourseAssignments from "@/operations/CourseAssignments";
import staffDocs from "@/operations/docs/staffs/index";
import studentDocs from "@/operations/docs/students";
import teachersDocs from "@/operations/docs/teachers";
import events from "@/operations/events";
import exams from "@/operations/exams";
import fees from "@/operations/fees";
import feesTemplates from "@/operations/feesTemplates";
import grades from "@/operations/grades";
import groups from "@/operations/groups";
import monitors from "@/operations/monitors";
import monitorStudent from "@/operations/monitors/component";
import payments from "@/operations/payments";
import profile from "@/operations/profile";
import promotions from "@/operations/promotions";
import publicContent from "@/operations/public";
import retakeExams from "@/operations/retakeExams";
import retakeExamSessions from "@/operations/retakeExamSessions";
import staffMembers from "@/operations/staffMembers";
import students from "@/operations/students";
import studentsResultOverviews from "@/operations/studentsResultOverviews";
import teachers from "@/operations/teachers";
import authProvider from "@/providers/authProvider";
import dataProvider from "@/providers/dataProvider";
import HaLoginPage from "@/security/LoginPage";
import {HaLayout} from "@/ui/haLayout";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import polyglotI18nProvider from "ra-i18n-polyglot";
import frenchMessages from "ra-language-french";
import {Admin, CustomRoutes, Resource} from "react-admin";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import studentCor from "./operations/cor/index2.ts";
import {DashboardContent} from "./operations/dashboard/Dashboard.tsx";
import {MonitorStudentList} from "./operations/monitors/component/MonitorStudentList.tsx";
import {UnlinkedStudentsList} from "./operations/monitors/UnlinkedStudentsList.tsx";
import retakeExamCourses from "./operations/retakeExamCourses";
import CasdoorAuthCallback from "./security/CasdoorAuth.tsx";

function AppBase() {
  return (
    <Admin
      title="HEI Admin"
      authProvider={authProvider}
      dataProvider={dataProvider}
      i18nProvider={polyglotI18nProvider(() => frenchMessages, "fr")}
      loginPage={HaLoginPage}
      dashboard={DashboardContent}
      theme={mainTheme}
      layout={HaLayout}
      requireAuth
    >
      <Resource name="profile" {...profile} />
      <Resource name="students" {...students} />
      <Resource name="teachers" {...teachers} />
      <Resource name="monitors" {...monitors} />
      <Resource name="monitor-students" {...monitorStudent} />
      <Resource name="groups" {...groups} />
      <Resource name="staffmembers" {...staffMembers} />
      <Resource name="fees" {...fees} />
      <Resource name="fees-templates" {...feesTemplates} />
      <Resource name="payments" {...payments} />
      <Resource name="docs" options={{label: "Documents"}} />
      <Resource name="comments" />
      <Resource name="promotions-groups" />
      <Resource name="promotions" {...promotions} />
      <Resource name="announcements" {...announcements} />
      <Resource name="course" {...course} />
      <Resource name="cor" {...cor} />
      <Resource name="student-cor" {...studentCor} />
      <Resource name="events" {...events} />
      <Resource name="users-letters" />
      <Resource name="letters" />
      <Resource name="retakeExams" {...retakeExams} />
      <Resource name="retakeExams-sessions" {...retakeExamSessions} />
      <Resource name="retakeExams-courses" {...retakeExamCourses} />
      <Resource name="students-result-overviews" {...studentsResultOverviews} />
      <Resource
        name="course-assignments"
        {...CourseAssignments}
        options={{label: " "}}
      />
      <Resource name="exams" {...exams} />
      <CustomRoutes>
        <Route exact path="/profile" element={<profile.show />} />
        <Route
          exact
          path="promotions/result-overviews"
          element={<studentsResultOverviews.list />}
        />
        <Route
          path="/promotions/:promotionId/show/students-result-overviews"
          element={<studentsResultOverviews.show />}
        />
        <Route exact path="/students/:studentId/fees" element={<fees.list />} />
        <Route
          exact
          path="/students/:studentId/fees/create"
          element={<fees.singStudentFeesCreate />}
        />
        <Route
          exact
          path="/fees/create"
          element={<fees.multipleStudentFeesCreate />}
        />
        <Route exact path="/fees/:feeId/show" element={<fees.show />} />
        <Route exact path="/fees" element={<fees.listByStatus />} />
        <Route exact path="/fees-to-archive" element={<fees.listToArchive />} />
        <Route exact path="/fees/:feeId/payments" element={<payments.list />} />
        <Route
          exact
          path="/fees/:feeId/payments/create"
          element={<payments.create />}
        />
        <Route
          exact
          path="/transactions"
          element={<fees.listByTransactions />}
        />
        <Route
          exact
          path="/credit-payments"
          element={<payments.listCreditPayments />}
        />
        <Route
          exact
          path="/docs/students/OTHER"
          element={<studentDocs.list />}
        />
        <Route
          exact
          path="/docs/teachers/OTHER"
          element={<teachersDocs.list />}
        />
        <Route exact path="/docs/staff/OTHER" element={<staffDocs.list />} />
        <Route
          exact
          path="/docs/students/WORK_DOCUMENT"
          element={<studentDocs.list />}
        />
        <Route
          exact
          path="/students/:userId/docs/students/OTHER"
          element={<studentDocs.list />}
        />
        <Route
          exact
          path="/teachers/:userId/docs/teachers/OTHER"
          element={<teachersDocs.list />}
        />
        <Route
          exact
          path="/staff/:userId/docs/staff/OTHER"
          element={<teachersDocs.list />}
        />
        <Route
          exact
          path="/students/:userId/docs/students/WORK_DOCUMENT"
          element={<studentDocs.list />}
        />
        <Route
          exact
          path="/students/:userId/docs/students/TRANSCRIPT"
          element={<studentDocs.list />}
        />
        <Route
          exact
          path="/students/:userId/docs/students/TRANSCRIPT/:id"
          element={<studentDocs.show />}
        />
        <Route
          exact
          path="/events/:eventId/participants"
          element={<events.participants />}
        />
        <Route exact path="/event_participants" element={<events.missing />} />
        <Route exact path="/events/new" element={<events.new />} />
        <Route
          exact
          path="/students/:userId/docs/students/OTHER/:id"
          element={<studentDocs.show />}
        />
        <Route
          exact
          path="/teachers/:userId/docs/teachers/OTHER/:id"
          element={<teachersDocs.show />}
        />
        <Route
          exact
          path="/staff/:userId/docs/staff/OTHER/:id"
          element={<staffDocs.show />}
        />
        <Route
          exact
          path="/docs/students/OTHER/:id"
          element={<studentDocs.show />}
        />
        <Route
          exact
          path="/docs/teachers/OTHER/:id"
          element={<teachersDocs.show />}
        />
        <Route
          exact
          path="/docs/staff/OTHER/:id"
          element={<staffDocs.show />}
        />
        <Route
          exact
          path="/students/:userId/docs/students/WORK_DOCUMENT/:id"
          element={<studentDocs.show />}
        />
        <Route
          exact
          path="/docs/students/WORK_DOCUMENT/:id"
          element={<studentDocs.show />}
        />
        <Route
          exact
          path="/monitors/:monitorId/students"
          element={<MonitorStudentList />}
        />
        <Route
          exact
          path="/monitors/unlinked-students"
          element={<UnlinkedStudentsList />}
        />
        <Route
          exact
          path="/monitor-students/:userId/docs/students/TRANSCRIPT"
          element={<studentDocs.list />}
        />
        <Route
          exact
          path="/monitor-students/:userId/docs/students/TRANSCRIPT/:id"
          element={<studentDocs.show />}
        />
        <Route
          exact
          path="/monitor-students/:userId/docs/students/WORK_DOCUMENT"
          element={<studentDocs.list />}
        />
        <Route
          exact
          path="/monitor-students/:userId/docs/students/WORK_DOCUMENT/:id"
          element={<studentDocs.show />}
        />
        <Route
          exact
          path="/monitor-students/:userId/docs/students/OTHER"
          element={<studentDocs.list />}
        />
        <Route
          exact
          path="/teachers/:userId/files/OTHER"
          element={<studentDocs.list />}
        />
        <Route
          exact
          path="/monitor-students/:userId/docs/students/OTHER/:id"
          element={<studentDocs.show />}
        />
        <Route
          exact
          path="/exams/:id/grades"
          element={<grades.examParticipantList />}
        />
        <Route exact path="/retake-exams" element={<retakeExams.list />} />
        <Route
          exact
          path="/retake-exams/cancellation"
          element={<retakeExams.cancellation />}
        />
        <Route
          path="student/retake-exams"
          element={<retakeExams.listMyRetakes />}
        />
      </CustomRoutes>
    </Admin>
  );
}

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <Routes>
          <Route
            path={
              process.env.REACT_APP_CASDOOR_SDK_REDIRECT_PATH ||
              "/auth/callback"
            }
            element={<CasdoorAuthCallback />}
          />
          <Route path="/calendar" element={<publicContent.calendar />} />
          <Route path="*" element={<AppBase />} />
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
