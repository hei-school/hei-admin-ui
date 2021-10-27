import WeekPickerHook from './WeekPickerHook'
const HaCardHeader = ({ date }) => {
  const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '0px 30px'
  }
  return (
    <div style={style} className='HaCardHeader'>
      <div className='title'>
        <h2>[HEI] Cours L1</h2>
      </div>
      <WeekPickerHook date={date} />
    </div>
  )
}

export default HaCardHeader
