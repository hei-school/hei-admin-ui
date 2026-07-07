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
import {AwsWafCaptchaHandler, HumanVerification} from "@/security/waf";
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


const FEES_ONLY = import.meta.env.VITE_FEES_ONLY === "true";



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
      <Resource name="fees" {...fees} />
      <Resource name="fees-templates" {...feesTemplates} />
      <Resource name="payments" {...payments} />

      {!FEES_ONLY && <Resource name="teachers" {...teachers} />}
      {!FEES_ONLY && <Resource name="monitors" {...monitors} />}
      {!FEES_ONLY && <Resource name="monitor-students" {...monitorStudent} />}
      {!FEES_ONLY && <Resource name="groups" {...groups} />}
      {!FEES_ONLY && <Resource name="staffmembers" {...staffMembers} />}
      {!FEES_ONLY && <Resource name="docs" options={{label: "Documents"}} />}
      {!FEES_ONLY && <Resource name="comments" />}
      {!FEES_ONLY && <Resource name="promotions-groups" />}
      {!FEES_ONLY && <Resource name="promotions" {...promotions} />}
      {!FEES_ONLY && <Resource name="announcements" {...announcements} />}
      {!FEES_ONLY && <Resource name="course" {...course} />}
      {!FEES_ONLY && <Resource name="cor" {...cor} />}
      {!FEES_ONLY && <Resource name="student-cor" {...studentCor} />}
      {!FEES_ONLY && <Resource name="events" {...events} />}
      {!FEES_ONLY && <Resource name="users-letters" />}
      {!FEES_ONLY && <Resource name="letters" />}
      {!FEES_ONLY && <Resource name="retakeExams" {...retakeExams} />}
      {!FEES_ONLY && <Resource name="retakeExams-sessions" {...retakeExamSessions} />}
      {!FEES_ONLY && <Resource name="retakeExams-courses" {...retakeExamCourses} />}
      {!FEES_ONLY && <Resource name="students-result-overviews" {...studentsResultOverviews} />}
      {!FEES_ONLY && (
        <Resource
          name="course-assignments"
          {...CourseAssignments}
          options={{label: " "}}
        />
      )}
      {!FEES_ONLY && <Resource name="exams" {...exams} />}

      <CustomRoutes>
        {/* ── Routes toujours disponibles ── */}
        <Route exact path="/profile" element={<profile.show />} />
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

        {/* ── Routes disponibles UNIQUEMENT en mode complet ── */}
        {!FEES_ONLY && (
          <Route
            exact
            path="promotions/result-overviews"
            element={<studentsResultOverviews.list />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            path="/promotions/:promotionId/show/students-result-overviews"
            element={<studentsResultOverviews.show />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/docs/students/OTHER"
            element={<studentDocs.list />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/docs/teachers/OTHER"
            element={<teachersDocs.list />}
          />
        )}
        {!FEES_ONLY && (
          <Route exact path="/docs/staff/OTHER" element={<staffDocs.list />} />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/docs/students/WORK_DOCUMENT"
            element={<studentDocs.list />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/students/:userId/docs/students/OTHER"
            element={<studentDocs.list />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/teachers/:userId/docs/teachers/OTHER"
            element={<teachersDocs.list />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/staff/:userId/docs/staff/OTHER"
            element={<teachersDocs.list />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/students/:userId/docs/students/WORK_DOCUMENT"
            element={<studentDocs.list />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/students/:userId/docs/students/TRANSCRIPT"
            element={<studentDocs.list />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/students/:userId/docs/students/TRANSCRIPT/:id"
            element={<studentDocs.show />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/events/:eventId/participants"
            element={<events.participants />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/event_participants"
            element={<events.missing />}
          />
        )}
        {!FEES_ONLY && (
          <Route exact path="/events/new" element={<events.new />} />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/students/:userId/docs/students/OTHER/:id"
            element={<studentDocs.show />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/teachers/:userId/docs/teachers/OTHER/:id"
            element={<teachersDocs.show />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/staff/:userId/docs/staff/OTHER/:id"
            element={<staffDocs.show />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/docs/students/OTHER/:id"
            element={<studentDocs.show />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/docs/teachers/OTHER/:id"
            element={<teachersDocs.show />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/docs/staff/OTHER/:id"
            element={<staffDocs.show />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/students/:userId/docs/students/WORK_DOCUMENT/:id"
            element={<studentDocs.show />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/docs/students/WORK_DOCUMENT/:id"
            element={<studentDocs.show />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/monitors/:monitorId/students"
            element={<MonitorStudentList />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/monitors/unlinked-students"
            element={<UnlinkedStudentsList />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/monitor-students/:userId/docs/students/TRANSCRIPT"
            element={<studentDocs.list />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/monitor-students/:userId/docs/students/TRANSCRIPT/:id"
            element={<studentDocs.show />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/monitor-students/:userId/docs/students/WORK_DOCUMENT"
            element={<studentDocs.list />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/monitor-students/:userId/docs/students/WORK_DOCUMENT/:id"
            element={<studentDocs.show />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/monitor-students/:userId/docs/students/OTHER"
            element={<studentDocs.list />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/teachers/:userId/files/OTHER"
            element={<studentDocs.list />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/monitor-students/:userId/docs/students/OTHER/:id"
            element={<studentDocs.show />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/exams/:id/grades"
            element={<grades.examParticipantList />}
          />
        )}
        {!FEES_ONLY && (
          <Route exact path="/retake-exams" element={<retakeExams.list />} />
        )}
        {!FEES_ONLY && (
          <Route
            exact
            path="/retake-exams/cancellation"
            element={<retakeExams.cancellation />}
          />
        )}
        {!FEES_ONLY && (
          <Route
            path="student/retake-exams"
            element={<retakeExams.listMyRetakes />}
          />
        )}
      </CustomRoutes>
    </Admin>
  );
}

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <AwsWafCaptchaHandler />
        <Routes>
          <Route
            path={
              process.env.REACT_APP_CASDOOR_SDK_REDIRECT_PATH ||
              "/auth/callback"
            }
            element={<CasdoorAuthCallback />}
          />
          <Route path="/calendar" element={<publicContent.calendar />} />
          <Route path="/human-verification" element={<HumanVerification />} />
          <Route path="*" element={<AppBase />} />
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;