import { Link } from 'react-admin';
import { Button } from '@mui/material';

export function LinkButton({ to, icon, label, ...rest }){
  return(
    <Link to={to}>
      <Button 
        variant='text' 
        size='small' 
        sx={{'& .MuiSvgIcon-root':{mr: .5}}}
         {...rest}
      >
        {icon} {label}
      </Button>
    </Link>
  ) 
}
