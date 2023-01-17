import { mainTheme } from '../../haTheme'
import { FeeStatusEnum } from '../../gen/haClient'

const rowStyle = (record, _index) => {
  const lateColor = record.status === FeeStatusEnum.Late ? mainTheme.palette.error.light : 'inherit'
  return {
    backgroundColor: record.status === FeeStatusEnum.Paid ? mainTheme.palette.grey[300] : lateColor
  }
}

export default rowStyle
