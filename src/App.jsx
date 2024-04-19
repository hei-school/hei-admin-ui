import React from "react";
import polyglotI18nProvider from "ra-i18n-polyglot";
import frenchMessages from "ra-language-french";
import {Admin} from "@react-admin/ra-enterprise";
import {CustomRoutes, Resource} from "react-admin";
import {Route} from "react-router-dom";

import {HaLayout} from "./ui/haLayout";
import {mainTheme} from "./haTheme.js";
import {WaitUntilHot} from "./utils/retryer";

import dataProvider from "./providers/dataProvider";
import authProvider from "./providers/authProvider.ts";

import groups from "./operations/groups";
import profile from "./operations/profile";
import students from "./operations/students";
import teachers from "./operations/teachers";
import announcements from "./operations/announcements";
import fees from "./operations/fees";
import feesTemplates from "./operations/feesTemplates";
import payments from "./operations/payments";
import heiDocs from "./operations/docs/hei";
import studentDocs from "./operations/docs/students";
import HaLoginPage from "./security/LoginPage";

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
      <Resource name="groups" {...groups} />

      <Resource name="fees" {...fees} />
      <Resource name="fees-templates" {...feesTemplates} />
      <Resource name="payments" {...payments} />
      <Resource name="docs" options={{label: "Documents"}} />
      <Resource name="comments" />
      <Resource name="annoucements" {...announcements} />

      <CustomRoutes>
        <Route exact path="/profile" element={<profile.show />} />

        <Route exact path="/students/:studentId/fees" element={<fees.list />} />
        <Route
          exact
          path="/students/:studentId/fees/create"
          element={<fees.create />}
        />
        <Route exact path="/fees/:feeId/show" element={<fees.show />} />
        <Route exact path="/fees" element={<fees.listByStatus />} />

        <Route exact path="/fees/:feeId/payments" element={<payments.list />} />
        <Route
          exact
          path="/fees/:feeId/payments/create"
          element={<payments.create />}
        />

        <Route exact path="/docs/school" element={<heiDocs.list />} />
        <Route exact path="/docs/school/:id" element={heiDocs.show} />
        <Route exact path="/docs/school/create" element={<heiDocs.create />} />

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
          path="/docs/students/WORK_DOCUMENT"
          element={<studentDocs.list />}
        />

        <Route
          exact
          path="/students/:studentId/docs/students/OTHER"
          element={<studentDocs.list />}
        />
        <Route
          exact
          path="/students/:studentId/docs/students/WORK_DOCUMENT"
          element={<studentDocs.list />}
        />
        <Route
          exact
          path="/students/:studentId/docs/students/TRANSCRIPT"
          element={<studentDocs.list />}
        />
        <Route
          exact
          path="/students/:studentId/docs/students/TRANSCRIPT/:id"
          element={<studentDocs.show />}
        />
        <Route
          exact
          path="/students/:studentId/docs/students/OTHER/:id"
          element={<studentDocs.show />}
        />
        <Route
          exact
          path="/students/:studentId/docs/students/WORK_DOCUMENT/:id"
          element={<studentDocs.show />}
        />
      </CustomRoutes>
    </Admin>
  );
}

function App() {
  return <AppBase />;
}

export default App;
