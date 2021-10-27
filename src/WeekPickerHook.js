import clsx from 'clsx'
import DateFnsUtils from '@date-io/date-fns'
import format from 'date-fns/format'
import isValid from 'date-fns/isValid'
import isSameDay from 'date-fns/isSameDay'
import React, { useState } from 'react'
import endOfWeek from 'date-fns/endOfWeek'
import startOfWeek from 'date-fns/startOfWeek'
import isWithinInterval from 'date-fns/isWithinInterval'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { createStyles } from '@material-ui/styles'
import { IconButton, withStyles } from '@material-ui/core'
import { weekPicked } from './redux/reduxEvents'
import { useDispatch } from 'react-redux'

const WeekPickerHook = props => {
  const [selectedDate, setSelectedDate] = useState(props.date)
  const dispatch = useDispatch()

  const handleWeekChange = date => {
    var beginDate = startOfWeek(new Date(date))
    setSelectedDate(beginDate)
    dispatch({
      type: weekPicked,
      date: {
        date: beginDate
      }
    })
  }

  const formatWeekSelectLabel = (date, invalidLabel) => {
    let dateClone = new Date(date)
    return dateClone && isValid(dateClone) ? `Semaine du ${format(startOfWeek(dateClone), 'dd-MMM')}` : invalidLabel
  }

  const renderWrappedWeekDay = (date, selectedDate, dayInCurrentMonth) => {
    const { classes } = props
    let dateClone = new Date(date)
    let selectedDateClone = new Date(selectedDate)

    const start = startOfWeek(selectedDateClone)
    const end = endOfWeek(selectedDateClone)

    const dayIsBetween = isWithinInterval(dateClone, { start, end })
    const isFirstDay = isSameDay(dateClone, start)
    const isLastDay = isSameDay(dateClone, end)

    const wrapperClassName = clsx({
      [classes.highlight]: dayIsBetween,
      [classes.firstHighlight]: isFirstDay,
      [classes.endHighlight]: isLastDay
    })

    const dayClassName = clsx(classes.day, {
      [classes.nonCurrentMonthDay]: !dayInCurrentMonth,
      [classes.highlightNonCurrentMonthDay]: !dayInCurrentMonth && dayIsBetween
    })

    return (
      <div className={wrapperClassName}>
        <IconButton className={dayClassName}>
          <span> {format(dateClone, 'd')} </span>
        </IconButton>
      </div>
    )
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker value={selectedDate} onChange={handleWeekChange} renderDay={renderWrappedWeekDay} labelFunc={formatWeekSelectLabel} />
    </MuiPickersUtilsProvider>
  )
}

const styles = createStyles(theme => ({
  dayWrapper: {
    position: 'relative'
  },
  day: {
    width: 36,
    height: 36,
    fontSize: theme.typography.caption.fontSize,
    margin: '0 2px',
    color: 'inherit'
  },
  customDayHighlight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '2px',
    right: '2px',
    border: `1px solid ${theme.palette.secondary.main}`,
    borderRadius: '50%'
  },
  nonCurrentMonthDay: {
    color: theme.palette.text.disabled
  },
  highlightNonCurrentMonthDay: {
    color: '#676767'
  },
  highlight: {
    background: theme.palette.primary.main,
    color: theme.palette.common.white
  },
  firstHighlight: {
    extend: 'highlight',
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%'
  },
  endHighlight: {
    extend: 'highlight',
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%'
  }
}))

export default withStyles(styles)(WeekPickerHook)
