/* eslint-disable no-undef */
import {mainTheme} from "@/haTheme";
import announcements from "@/operations/announcements";
import badges from "@/operations/badges";
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
import {QueryClient} from "react-query";
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import {publicIdFromRootPath} from "./operations/badges/badgeApi";
import studentCor from "./operations/cor/index2.ts";
import {DashboardContent} from "./operations/dashboard/Dashboard.tsx";
import {
  DocumensoDocumentsPage,
  MonitorDocumensoDocumentList,
} from "./operations/documenso";
import {StudentCreditTransactions} from "./operations/fees/components/Credits/StudentCreditTransactions.tsx";
import {MonitorStudentList} from "./operations/monitors/component/MonitorStudentList.tsx";
import {UnlinkedStudentsList} from "./operations/monitors/UnlinkedStudentsList.tsx";
import retakeExamCourses from "./operations/retakeExamCourses";
import {
  SmsCampaignCreate,
  SmsCampaignList,
  SmsContactGroupList,
  SmsContactGroupShow,
  SmsContactList,
} from "./operations/sms";
import CasdoorAuthCallback from "./security/CasdoorAuth.tsx";

const queryClient = new QueryClient({
  defaultOptions: {queries: {refetchOnWindowFocus: false}},
});

const AppBase = () => {
  return (
    <Admin
      title="HEI Admin"
      queryClient={queryClient}
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
      <Resource name="documenso-templates" />
      <Resource name="template-promotions" />
      <Resource name="promotions-documenso-documents" />
      <Resource name="monitors-documenso-documents" />
      <Resource name="documenso-file-urls" />
      <Resource name="documenso-signing-tokens" />
      <Resource name="sms-campaigns" />
      <Resource name="sms-campaign-logs" />
      <Resource name="sms-contact-groups" />
      <Resource name="sms-contacts" />
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
        <Route path="/profile" element={<profile.show />} />
        <Route
          path="promotions/result-overviews"
          element={<studentsResultOverviews.list />}
        />
        <Route
          path="/promotions/:promotionId/show/students-result-overviews"
          element={<studentsResultOverviews.show />}
        />
        <Route path="/students/:studentId/fees" element={<fees.list />} />
        <Route
          path="/students/:studentId/credit-transactions"
          element={<StudentCreditTransactions />}
        />
        <Route
          path="/students/:studentId/fees/create"
          element={<fees.singStudentFeesCreate />}
        />
        <Route
          path="/fees/create"
          element={<fees.multipleStudentFeesCreate />}
        />
        <Route path="/fees/:feeId/show" element={<fees.show />} />
        <Route path="/fees" element={<fees.listByStatus />} />
        <Route path="/fees-to-archive" element={<fees.listToArchive />} />
        <Route path="/fees/:feeId/payments" element={<payments.list />} />
        <Route
          path="/fees/:feeId/payments/create"
          element={<payments.create />}
        />
        <Route path="/transactions" element={<fees.listByTransactions />} />
        <Route
          path="/credit-payments"
          element={<payments.listCreditPayments />}
        />
        <Route path="/docs/students/OTHER" element={<studentDocs.list />} />
        <Route path="/docs/teachers/OTHER" element={<teachersDocs.list />} />
        <Route path="/docs/staff/OTHER" element={<staffDocs.list />} />
        <Route
          path="/docs/students/WORK_DOCUMENT"
          element={<studentDocs.list />}
        />
        <Route
          path="/students/:userId/docs/students/OTHER"
          element={<studentDocs.list />}
        />
        <Route
          path="/teachers/:userId/docs/teachers/OTHER"
          element={<teachersDocs.list />}
        />
        <Route
          path="/staff/:userId/docs/staff/OTHER"
          element={<teachersDocs.list />}
        />
        <Route
          path="/students/:userId/docs/students/WORK_DOCUMENT"
          element={<studentDocs.list />}
        />
        <Route
          path="/students/:userId/docs/students/TRANSCRIPT"
          element={<studentDocs.list />}
        />
        <Route
          path="/students/:userId/docs/students/TRANSCRIPT/:id"
          element={<studentDocs.show />}
        />
        <Route
          path="/events/:eventId/participants"
          element={<events.participants />}
        />
        <Route path="/event_participants" element={<events.missing />} />
        <Route path="/badges/scan" element={<badges.scan />} />
        <Route path="/badges/attendance" element={<badges.attendance />} />
        <Route path="/events/new" element={<events.new />} />
        <Route
          path="/students/:userId/docs/students/OTHER/:id"
          element={<studentDocs.show />}
        />
        <Route
          path="/teachers/:userId/docs/teachers/OTHER/:id"
          element={<teachersDocs.show />}
        />
        <Route
          path="/staff/:userId/docs/staff/OTHER/:id"
          element={<staffDocs.show />}
        />
        <Route path="/docs/students/OTHER/:id" element={<studentDocs.show />} />
        <Route
          path="/docs/teachers/OTHER/:id"
          element={<teachersDocs.show />}
        />
        <Route path="/docs/staff/OTHER/:id" element={<staffDocs.show />} />
        <Route
          path="/students/:userId/docs/students/WORK_DOCUMENT/:id"
          element={<studentDocs.show />}
        />
        <Route
          path="/docs/students/WORK_DOCUMENT/:id"
          element={<studentDocs.show />}
        />
        <Route
          path="/monitors/:monitorId/students"
          element={<MonitorStudentList />}
        />
        <Route
          path="/monitors/:monitorId/documenso-documents"
          element={<MonitorDocumensoDocumentList />}
        />
        <Route
          path="/documenso-documents"
          element={<DocumensoDocumentsPage />}
        />
        <Route path="/sms-campaigns" element={<SmsCampaignList />} />
        <Route path="/sms-campaigns/create" element={<SmsCampaignCreate />} />
        <Route path="/sms-contact-groups" element={<SmsContactGroupList />} />
        <Route
          path="/sms-contact-groups/:id"
          element={<SmsContactGroupShow />}
        />
        <Route path="/sms-contacts" element={<SmsContactList />} />
        <Route
          path="/monitors/unlinked-students"
          element={<UnlinkedStudentsList />}
        />
        <Route
          path="/monitor-students/:userId/docs/students/TRANSCRIPT"
          element={<studentDocs.list />}
        />
        <Route
          path="/monitor-students/:userId/docs/students/TRANSCRIPT/:id"
          element={<studentDocs.show />}
        />
        <Route
          path="/monitor-students/:userId/docs/students/WORK_DOCUMENT"
          element={<studentDocs.list />}
        />
        <Route
          path="/monitor-students/:userId/docs/students/WORK_DOCUMENT/:id"
          element={<studentDocs.show />}
        />
        <Route
          path="/monitor-students/:userId/docs/students/OTHER"
          element={<studentDocs.list />}
        />
        <Route
          path="/teachers/:userId/files/OTHER"
          element={<studentDocs.list />}
        />
        <Route
          path="/monitor-students/:userId/docs/students/OTHER/:id"
          element={<studentDocs.show />}
        />
        <Route
          path="/exams/:id/grades"
          element={<grades.examParticipantList />}
        />
        <Route path="/retake-exams" element={<retakeExams.list />} />
        <Route
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
};

// The badge QR code may hold the short link https://<site>/<public id>: public page, no login.
const AppOrPublicStudent = () => {
  const {pathname} = useLocation();
  const publicId = publicIdFromRootPath(pathname);
  return publicId ? <publicContent.student publicId={publicId} /> : <AppBase />;
};

const App = () => {
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
          <Route
            path="/public/students/:publicId"
            element={<publicContent.student />}
          />
          <Route path="*" element={<AppOrPublicStudent />} />
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
};

export default App;
