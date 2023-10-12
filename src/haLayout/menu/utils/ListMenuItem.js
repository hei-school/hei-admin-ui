import { Collapse } from '@mui/material'
import { useContext } from 'react'
import { MenuContext } from './ListMenu'
import SingleMenu from './SingleMenu';

function ListMenuItem({ label, icon, sx = {}, to, ...rest }){
  const menuContext = useContext(MenuContext)

  if(!menuContext){
    throw new Error('ListMenuItem is only used inside ListMenu');
  }
 
  return (
  <>
    <Collapse in={menuContext.showList} timeout="auto" unmountOnExit>
      <SingleMenu 
        label={label}
        to={to} 
        icon={icon} 
        sx={{ pl: 4.5, pr: 3, ...sx}}
        fontSize='.9em'
        {...rest}
      />
    </Collapse>
  </>
  )
}

export default ListMenuItem;
