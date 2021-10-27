import { Card, CardContent } from '@material-ui/core'
import * as React from 'react'
import Timetable from '../timetable/Timetable'
import WeekPickerHook from '../WeekPickerHook'
import { getCoursesFrom } from '../providers/staticDataProvider'
import endOfWeek from 'date-fns/endOfWeek'
import startOfWeek from 'date-fns/startOfWeek'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const today = useSelector(state => state.week)
  let start = startOfWeek(today.date)
  let end = endOfWeek(today.date)
  var courses = getCoursesFrom(start, end)
  return (
    <Card>
      <CardContent>
        <WeekPickerHook date={today.date} />
        <Timetable courses={courses} />
      </CardContent>
    </Card>
  )
}
export default Dashboard
