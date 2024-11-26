import React from "react";
import {Admin, CustomRoutes, Resource} from "react-admin";
import {Route} from "react-router-dom";
import polyglotI18nProvider from "ra-i18n-polyglot";
import frenchMessages from "ra-language-french";
import {HaLayout} from "@/ui/haLayout";
import {mainTheme} from "@/haTheme";
import dataProvider from "@/providers/dataProvider";
import authProvider from "@/providers/authProvider";
import HaLoginPage from "@/security/LoginPage";
import groups from "@/operations/groups";
import profile from "@/operations/profile";
import students from "@/operations/students";
import teachers from "@/operations/teachers";
import announcements from "@/operations/announcements";
import fees from "@/operations/fees";
import feesTemplates from "@/operations/feesTemplates";
import payments from "@/operations/payments";
import studentDocs from "@/operations/docs/students";
import teachersDocs from "@/operations/docs/teachers";
import promotions from "@/operations/promotions/index.tsx";
import course from "@/operations/course/index.tsx";
import awardedCourses from "./operations/awardedCourses";
import events from "@/operations/events";

import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import monitors from "@/operations/monitors";
import monitorStudent from "@/operations/monitors/component";
import MonitorStudentList from "@/operations/monitors/component/MonitorStudentList";
import exams from "@/operations/exams";

function AppBase() {
  return (
    <Admin
      title="HEI Admin"
      authProvider={authProvider}
      dataProvider={dataProvider}
      i18nProvider={polyglotI18nProvider(() => frenchMessages, "fr")}
      loginPage={HaLoginPage}
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

      <Resource name="fees" {...fees} />
      <Resource name="fees-templates" {...feesTemplates} />
      <Resource name="payments" {...payments} />
      <Resource name="docs" options={{label: "Documents"}} />
      <Resource name="comments" />
      <Resource name="promotions-groups" />
      <Resource name="promotions" {...promotions} />
      <Resource name="announcements" {...announcements} />
      <Resource name="course" {...course} />
      <Resource name="events" {...events} />
      <Resource name="users-letters" />
      <Resource name="letters" />
      <Resource
        name="awarded-courses"
        {...awardedCourses}
        options={{label: " "}}
      />
      <Resource name="exams" {...exams} />
      <CustomRoutes>
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

        <Route
          exact
          path="/docs/students/TRANSCRIPT"
          element={<studentDocs.list />}
        />
        <Route
          exact
          path="/docs/students/TRANSCRIPT/:id"
          element={<studentDocs.show />}
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
        <Route exact path="/events/new" element={<events.new />} />
        <Route
          exact
          path="/docs/students/TRANSCRIPT/:id"
          element={<studentDocs.show />}
        />
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
      </CustomRoutes>
    </Admin>
  );
}

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AppBase />
    </LocalizationProvider>
  );
}

export default App;
