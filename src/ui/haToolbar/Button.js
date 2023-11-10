import { Link, useListContext } from 'react-admin';
import { Button } from '@mui/material';
import { AddOutlined, Download } from '@mui/icons-material';
import styled from '@emotion/styled';
import { exporter } from '../../operations/utils';

export const HaActionWrapper = styled('div')({
  width: '100%',
  '& .MuiButton-root':{
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'start',
    gap: 10,
    paddingLeft:'20px',
    paddingTop:'7px',
    paddingBottom:'7px',
    color: '#474645',
    textTransform:'none'
  },
  '& .MuiSvgIcon-root':{
    fontSize:'25px'
  }
})

export function LinkButton({ to, icon, label, ...rest }){
  return(
    <HaActionWrapper>
      <Link to={to} sx={{w:'100%'}}>
        <Button variant='text' size='small' {...rest}>
          {icon} {label}
        </Button>
      </Link>
    </HaActionWrapper>
  ) 
}

export function CreateButton(){
  const list = useListContext()
  return (
    <LinkButton
      label='Créer'
      to={`/${list.resource}/create`}
      icon={<AddOutlined />}
    />
  )
}

export function ExportButton({...rest}){
  const list = useListContext()
  const exportData = ()=> exporter(list.data,[], list.resource)
  return (
    <HaActionWrapper onClick={exportData}>
      <Button variant='text' size='small' {...rest}>
        <Download sx={{fontSize:'15px'}}/> Exporter
      </Button>
    </HaActionWrapper>
  )
}
