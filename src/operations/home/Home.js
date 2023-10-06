import React from 'react'
import { Box } from '@mui/material'
import StatStudent from './StatStudent'
import StatMoney from './StatMoney'
import CardNumber from './utils/CardNumber' 
import HelloBox from './HelloBox'
import { getIconValues } from './utils/config'
import authProvider from '../../providers/authProvider'
import { WhoamiRoleEnum } from '../../gen/haClient'

//mock
const data = [ 300, 3, 10, 3 ]

function Home(){
  const icons = getIconValues()
  const role = authProvider.getCachedRole()

  return (
    <Box sx={{ width:'100%', p: 1, height:'100%', backgroundColor:'#ebe9e6' }}>
      <HelloBox />
      <Box sx={{ display:'flex',width:'100%', gap:1, justifyContent: 'space-evenly'}}>
        { icons.map((el, index) => <CardNumber key={index} value={{...el, count: data[index]}} /> )}
      </Box>
      <Box sx={{ display:'flex', gap: 1, alignItems:'start'}}>
        <StatStudent />
        { role === WhoamiRoleEnum.Manager && <StatMoney /> }
      </Box>
    </Box>
  ) 
} 

export default Home; 
