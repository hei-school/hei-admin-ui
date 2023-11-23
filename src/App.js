import React from 'react'
import { Admin } from '@react-admin/ra-enterprise'
import { CustomRoutes, Resource } from 'react-admin'
import { Route } from 'react-router-dom'
import groups from './operations/groups'

import dataProvider from './providers/dataProvider'
import authProvider from './providers/authProvider.ts'

import polyglotI18nProvider from 'ra-i18n-polyglot'
import frenchMessages from 'ra-language-french'

import profile from './operations/profile'
import students from './operations/students'
import teachers from './operations/teachers'
import docs from './operations/docs'

import fees from './operations/fees'
import payments from './operations/payments'

import { HaLayout } from './ui/haLayout'
import HaLoginPage from './security/LoginPage'
import { heiDocs } from './operations/heiDocs'

const FeeCreate = React.lazy(() => import('./operations/fees/FeesCreate'))

const App = () => (
  <Admin
    title='HEI Admin'
    authProvider={authProvider}
    dataProvider={dataProvider}
    i18nProvider={polyglotI18nProvider(() => frenchMessages, 'fr')}
    loginPage={HaLoginPage}
    layout={HaLayout}
    requireAuth
  >
    <Resource name='profile' />
    <Resource name='students' {...students} />
    <Resource name='teachers' {...teachers} />
    <Resource name='hei-docs' {...heiDocs} />
    <Resource name='groups' {...groups} />

    <Resource name='fees' {...fees} />
    <Resource name='payments' {...payments} />

    <CustomRoutes>
      <Route exact path='/profile' element={<profile.show />} />

      <Route exact path='/students/:studentId/fees' element={<fees.list />} />
      <Route
        exact
        path='/students/:studentId/fees/create'
        element={
          <React.Suspense fallback='Veuillez patienter...'>
            <FeeCreate />
          </React.Suspense>
        }
      />
      <Route exact path='/fees/:feeId/show' element={<fees.show />} />
      <Route exact path='/fees' element={<fees.listByStatus />} />

      <Route exact path='/fees/:feeId/payments' element={<payments.list />} />
      <Route exact path='/fees/:feeId/payments/create' element={<payments.create />} />

      <Route exact path='/docs/hei-docs' element={<docs.list title='Documents reliés à HEI' resource='hei-docs' />} />
    </CustomRoutes>
  </Admin>
)

export default App
