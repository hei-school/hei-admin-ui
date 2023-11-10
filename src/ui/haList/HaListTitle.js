import { MenuOutlined, SearchOutlined } from '@mui/icons-material'
import { Box, Typography, IconButton, Popover } from '@mui/material'
import { styled } from '@mui/styles'
import { useListFilterContext } from 'ra-core'
import { useState } from 'react'
import { HaMainSearch } from './HaMainSearch'

const TitleContainer = styled('div')({
  display:'flex',
  alignItems:'center',
  justifyContent:'space-between',
  color: '#575757',
  marginBottom: 15,
  padding: '15px 20px',
  borderBottom: '1px solid #e8e9eb',
})


const MainSearchContainer = styled('div')({
  display:'flex',
  alignItems:'center',
  gap: 5,
  boxShadow:'0px 0px 2px rgba(0,0,0,.3)',
  padding: '0px 15px',
  borderRadius:'15px',
})


export function HaListTitle({ title, icon, actions, mainSearch }){
  const [showAction, setShowAction] = useState(null)
  const { filterValues } = useListFilterContext()
  
  const showIndication = ()=>{
    const isFilterApplied = Object.keys(filterValues || []).some(el => el !== mainSearch.source)

    if(isFilterApplied){
      return {
        position: 'relative',
        display: 'block !important',
        '::after':  {
          content: '""',
          display: 'block',
          width:'10px',
          position: 'absolute',
          height:'10px',
          bgcolor: 'blue',
          top: '2px',
          borderRadius:'50%',
          right: '5px',
        }
      }
    }
    return {}
  } 

  return (
    <TitleContainer>
      <Box sx={{ display:'flex', alignItems:'center', gap: 2.5 }}>
        { icon }
        <Typography variant='h3' sx={{ fontSize: '1.07em', fontWeight: 500 }}>
          { title }
        </Typography>
      </Box>
      <Box sx={{display:'flex', alignItems:'center',gap: 1.5}}>
        <MainSearchContainer>
          <HaMainSearch source={mainSearch.source} label={mainSearch.label} />
          <label htmlFor='main-search'><SearchOutlined sx={{ p:0, transform:'translateY(4px)', cursor: 'pointer'}} /></label>
        </MainSearchContainer>
        { actions && 
          <Box sx={showIndication}>
            <IconButton  onClick={event => setShowAction( event.currentTarget )}>
              <MenuOutlined />
            </IconButton>
          </Box>
        }
      </Box>
      <Popover
        open={ showAction !== null }
        anchorEl={showAction}
        onClose={()=>setShowAction(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ width: '150px'}}>
          { actions }
        </Box>
      </Popover>
    </TitleContainer>
  )
}
