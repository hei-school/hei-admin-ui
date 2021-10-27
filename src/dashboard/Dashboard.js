import { Card, CardContent } from '@material-ui/core'
import * as React from 'react'
import Timetable from '../timetable/Timetable'
import { getCoursesFrom } from '../providers/staticDataProvider'
import endOfWeek from 'date-fns/endOfWeek'
import startOfWeek from 'date-fns/startOfWeek'
import { useSelector } from 'react-redux'
import HaCardHeader from '../HaCardHeader'

const Dashboard = () => {
  const startOfWeekPicked = useSelector(state => state.week)
  let start = startOfWeek(startOfWeekPicked.date)
  let end = endOfWeek(startOfWeekPicked.date)
  var courses = getCoursesFrom(start, end)
  return (
    <Card>
      <HaCardHeader date={startOfWeekPicked.date} />
      <CardContent>
        <Timetable courses={courses} />
      </CardContent>
    </Card>
  )
}
export default Dashboard
