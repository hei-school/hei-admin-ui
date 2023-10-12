import { createContext, useState } from 'react';
import {  Box } from '@mui/material'
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import SingleMenu from './SingleMenu';
import { useTheme } from '@mui/styles';

export const MenuContext = createContext();

function ListMenu({ children, label, icon, ...rest }){
  const [showList, setShowList] = useState(false);
  const theme = useTheme()

  return (
    <MenuContext.Provider value={{ showList }}>
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            cursor: 'pointer', 
            display:'flex',
            alignItems:'center',
            justifyContent: 'space-between',
            width:'100%',
            px: 3, 
            mb: showList ? 1.5 : 0,
            ':hover':{ color: theme.typography[':hover'] }
          }} 
          onClick={()=>setShowList(!showList)}
          {...rest}
        >
          <SingleMenu label={label} icon={icon} sx={{px: 0,pb: 0,cursor: 'pointer'}}/>
          { showList ? <ArrowDropUp /> : <ArrowDropDown /> }
        </Box>
        { children }
      </Box>
    </MenuContext.Provider>
  )
}

export default ListMenu;
