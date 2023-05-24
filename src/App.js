import { Admin } from '@react-admin/ra-enterprise'
import React from 'react'
import { CustomRoutes, Resource } from 'react-admin'

import { Route } from 'react-router-dom'

import authProvider from './providers/authProvider.ts'
import dataProvider from './providers/dataProvider'

import polyglotI18nProvider from 'ra-i18n-polyglot'
import frenchMessages from 'ra-language-french'
import courses from './operations/courses'
import grades from './operations/grades'
import profile from './operations/profile'
import students from './operations/students'
import teachers from './operations/teachers'

import fees from './operations/fees'
import payments from './operations/payments'

import MyLayout from './HaLayout'
import exams from './operations/exams'
import participants from './operations/participants'
import HaLoginPage from './security/LoginPage'
const FeeCreate = React.lazy(() => import('./operations/fees/FeesCreate'))
const App = () => (
  <Admin
    title='HEI Admin'
    authProvider={authProvider}
    dataProvider={dataProvider}
    i18nProvider={polyglotI18nProvider(() => frenchMessages, 'fr')}
    loginPage={HaLoginPage}
    layout={MyLayout}
    requireAuth
  >
    <Resource name='profile' />

    <Resource name='courses' {...courses} />
    <Resource name='exams' {...exams} />
    <Resource name='participants' {...participants} />

    <Resource name='students' {...students} />
    <Resource name='teachers' {...teachers} />

    <Resource name='fees' {...fees} />
    <Resource name='payments' {...payments} />

    <CustomRoutes>
      <Route exact path='/profile' element={<profile.show />} />
      <Route exact path='/courses/:courseId/exams' element={<exams.list />} />
      <Route exact path='/courses/:courseId/exams/create' element={<exams.create />} />

      <Route exact path='/students/:studentId/fees' element={<fees.list />} />

      <Route exact path='/grades/:studentId' element={<grades.list />} />
      <Route exact path='/courses/:courseId/exams/create' element={<exams.create />} />
      <Route exact path='/courses/:courseId/exams/:examId/show' element={<exams.show />} />

      <Route exact path='/students/:studentId/fees' element={<fees.list />} />
      <Route
        exact
        path='/students/:studentId/fees/create'
        element={
          <React.Suspense fallback='Veuillez patienter... '>
            <FeeCreate />
          </React.Suspense>
        }
      />
      <Route exact path='/fees/:feeId/show' element={<fees.show />} />
      <Route exact path='/fees' element={<fees.listByStatus />} />

      <Route exact path='/fees/:feeId/payments' element={<payments.list />} />
      <Route exact path='/fees/:feeId/payments/create' element={<payments.create />} />
    </CustomRoutes>
  </Admin>
)

export default App
