import './timetable.scss'
import { WeekDays, Intervals } from '../providers/staticDataProvider'
import { parseDate } from '../utils/dateUtils'
const Weeks = () => {
  return (
    <div className='week-names'>
      {WeekDays.map((value, index) => {
        return <div key={index}>{value.day}</div>
      })}
    </div>
  )
}
const TimeIntervals = () => {
  return (
    <div className='time-interval'>
      {Intervals.map((value, index) => {
        return <div key={index}>{value}</div>
      })}
    </div>
  )
}

const TimetableCell = ({ course }) => {
  if (course === null) {
    return <div></div>
  }
  return (
    <div className={'accent-' + course.group}>
      {course.group === 'other' ? '' : '[' + course.group + ']'} {course.code} <br /> {course.name}
      <br /> - <br /> {course.teacher}
    </div>
  )
}

export const Timetable = ({ courses }) => {
  const timetable = []
  const temporary = []
  const intervals = Intervals
  const weekDays = WeekDays

  for (let k = 0; k < weekDays.length; k++) {
    for (let i = 0; i < courses.length; i++) {
      for (let j = 0; j < courses[i].timetable.length; j++) {
        for (let l = 0; l < intervals.length; l++) {
          let courseHour = courses[i].timetable[j]
          let courseDate = new Date(courseHour.start)
          let start = Date.parse(courseHour.start)
          let end = Date.parse(courseHour.end)
          if (courseDate.getDay() === weekDays[k].value) {
            if (start <= parseDate(courseHour.start, intervals[l]) && end > parseDate(courseHour.end, intervals[l])) {
              let timetableCell = {
                day_index: k,
                time_index: l,
                course: {
                  group: courseHour.group === null ? 'other' : courseHour.group.ref,
                  code: courses[i].code,
                  name: courses[i].name,
                  teacher: courseHour.teacher_name
                }
              }
              temporary.push(timetableCell)
            }
          }
        }
      }
    }
  }

  for (let day = 0; day < weekDays.length; day++) {
    timetable[day] = { day: weekDays[day].value, intervals: [] }
    for (let time = 0; time < intervals.length; time++) {
      timetable[day].intervals[time] = { interval: intervals[time], course: null }
      for (let i = 0; i < temporary.length; i++) {
        if (day === temporary[i].day_index && time === temporary[i].time_index) {
          timetable[day].intervals[time].course = temporary[i].course
        }
      }
    }
  }

  const getTimetable = timetable => {
    let content = []
    let index = 1
    for (let time in intervals) {
      for (let day in timetable) {
        content.push(<TimetableCell key={index} course={timetable[day].intervals[time].course} />)
        index++
      }
    }
    return content
  }

  return (
    <div className='timetable'>
      <Weeks />
      <TimeIntervals />
      <div className='content'>{getTimetable(timetable)}</div>
    </div>
  )
}
export default Timetable
