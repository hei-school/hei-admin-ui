import { List, Datagrid } from 'react-admin'
import { styled } from '@mui/styles'
import { Box } from '@mui/material'
import { PrevNextPagination } from './PrevNextPagination'
import { HaListTitle } from './HaListTitle'

const ListWrapper = styled('div')({
  width:'100%', 
  height:'100%',
  overflow:'hidden',
  borderRadius: 10,
  marginTop: 10,
  boxShadow:'2px 2px 15px rgba(0,0,0,.1)'
})

const DatagridWrapper = styled('div')({
  padding: '0 15px',
  '& th, & th span': { 
    fontWeight: 600, 
    backgroundColor:'transparent !important',
    color: '#bf660d'
  },
  '& table, & th, & td, & tr ':{
    border: '1px solid #e8e9eb',
  },
  '& thead th span':{
    color: '#807d7a' 
  },
  '& tbody .MuiTableRow-root':{
    '&:hover': { backgroundColor: '#edf1fa' }
  }
})

export function HaList({ title,  actions, resource, children, icon,listProps={}, datagridProps = {}, mainSearch={source: 'q', label: 'q'}}){
  return (
    <ListWrapper>
      <List
        actions={false}
        pagination={<PrevNextPagination />}
        resource={ resource }
        sx={{ '& .MuiPaper-root': { boxShadow: 'none' }, '& td':{ border: 'none' }}}
        {...listProps}
      > 
        <Box>
          <HaListTitle actions={actions} title={title} icon={icon} mainSearch={mainSearch}/>
          <DatagridWrapper>
            <Datagrid { ...datagridProps } >
              {children}
            </Datagrid>
          </DatagridWrapper>
        </Box>
      </List> 
    </ListWrapper>
  )
}
