import { mainTheme } from '../../haTheme'

const rowStyle = (record, _index) => {
  const lateColor = record.status === 'LATE' ? '#faacb2' : 'inherit'
  return {
    backgroundColor: record.status === 'PAID' ? mainTheme.palette.grey[300] : lateColor
  }
}

export default rowStyle
