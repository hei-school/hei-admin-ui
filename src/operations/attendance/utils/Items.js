import { MenuItem, CircularProgress, Checkbox } from '@mui/material'
import { getObjValue } from './utils'

function Items({ options, labelKey, valueKey, onClick, checked }){
  if(options.data.length){
    return (
      options.data.map((el,index) =>{
        const label = getObjValue(el, labelKey)
        const value = getObjValue(el, valueKey)
        return (
          <MenuItem sx={{ py: 0, px: 1 }} onClick={()=>onClick({ label, value })} key={index} value={value}>
            <Checkbox 
              checked={Boolean(checked({ label, value }))} 
              size='small'
            />
            { getObjValue(el, labelKey) }
          </MenuItem >
        )
      })
    )
  }

  return (
    <>
      { !options.pending ? (
          <MenuItem value='' sx={{fontSize:'.8em',width:'100%', backgroundColor:'white !important' }}>
            Une erreur c'est produite
          </MenuItem>
        )
        :(
          <MenuItem value='' sx={{ backgroundColor:'white !important' }}>
            <CircularProgress style={{ width:'20px',height:'20px'}}/>
          </MenuItem>
        )
      }
    </>
  ) 
}

export default Items
