import { weekPicked } from './reduxEvents'

export const weekReducer = (previousState = { date: new Date('2021/11/08 00:00:00') }, { type, date }) => {
  if (type === weekPicked && date !== undefined) {
    return date
  }
  return previousState
}

export default weekReducer
