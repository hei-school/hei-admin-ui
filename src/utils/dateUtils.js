export function extractDate(date) {
  return date.substr(0, 10)
}

export function parseDate(date, hour) {
  return Date.parse(extractDate(date) + ' ' + hour + ':00:00')
}
