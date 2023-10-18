import React, { useEffect, useState } from 'react'
import { Admin } from '@react-admin/ra-enterprise'
import { CustomRoutes, Resource } from 'react-admin'
import { Route } from 'react-router-dom'

import dataProvider from './providers/dataProvider'
import authProvider from './providers/authProvider.ts'

import polyglotI18nProvider from 'ra-i18n-polyglot'
import frenchMessages from 'ra-language-french'

import profile from './operations/profile'
import students from './operations/students'
import teachers from './operations/teachers'
import docs from './operations/docs'
import attendance from './operations/attendance'

import fees from './operations/fees'
import payments from './operations/payments'

import MyLayout from './HaLayout'
import HaLoginPage from './security/LoginPage'
import { heiDocs } from './operations/heiDocs'
import { qrcode } from './operations/attendance/create/config'
import attendanceProvider from './providers/attendanceProvider'

const FeeCreate = React.lazy(() => import('./operations/fees/FeesCreate'))

const App = () => {
  const [ sending, setSending ] = useState(false)

  useEffect(()=>{
    const config = qrcode.getConfig()
    const interval = setInterval(()=>{
      const attendance = qrcode.getAttendance() 

      if(!sending && attendance.length > 0){
        setSending(true)
        const endIndex = attendance.length > config.send ? config.send : attendance.length

        attendanceProvider.saveOrUpdate(attendance.slice(0, endIndex))
          .then(()=> {
            qrcode.setAttendance(attendance.slice(0, endIndex))
            setSending(false)
          })
          .catch(() => setSending(false))
      }
    },config.interval)

    return ()=>clearInterval(interval)
  },[sending])

  return (
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
      <Resource name='students' {...students} />
      <Resource name='teachers' {...teachers} />
      <Resource name='hei-docs' {...heiDocs} />
      <Resource name='fees' {...fees} />
      <Resource name='payments' {...payments} />
      <Resource name='attendance' {...attendance} />

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
        <Route exact path='/attendance/scan' element={<attendance.scan title='Présence' />} />
      </CustomRoutes>
    </Admin>
  )
}

export default App;
