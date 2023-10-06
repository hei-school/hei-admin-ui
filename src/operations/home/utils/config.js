import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { WhoamiRoleEnum } from '../../../gen/haClient';
import { 
  Error , 
  Woman,
  School,
  WatchLater,
  Rule
} from '@mui/icons-material'
import authProvider from '../../../providers/authProvider';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const createBasicConfig= (options = {}) => {
  return {
    responsive: true,
    scales: {
      x:{
        border: { display: false},
        grid: { display: false }
      },
      y:{
        border: { display: false},
        grid: { display: false }
      }
    },
    elements:{
      point:{ radius: 0 }
    },
    ...options
  }
}

export const getIconValues= ()=>{
  const role = authProvider.getCachedRole()
  const values = [
    { label: 'Étudiants', icon: <School sx={{ fontSize:'2em', color: '#60bfd6'}} /> }, 
    { label: 'Filles', icon: <Woman sx={{ fontSize:'2.2em', color: '#f7d652'}}/> }, 
    { label: 'Absences', icon: <WatchLater  sx={{ fontSize:'2em', color: '#5bd465'}} /> },
    { label: 'Cors', icon: <Error sx={{ fontSize:'2em', color: '#ed7866'}} />}
  ] 
  
  if(role === WhoamiRoleEnum.Teacher){
    values[2] = { label: 'Cours Enseignés', icon: <Rule sx={{ fontSize:'2em', color: '#5bd465'}} />}
  }
  else if(role === WhoamiRoleEnum.Student){
    //TODO :change the first values
    values[0] = { label: 'Mise à pieds', icon: <Rule sx={{ fontSize:'2em', color: '#5bd465'}} />}
    values[1] = { label: 'Mise à pieds', icon: <Error sx={{ fontSize:'2em', color: '#ed7866'}} />}
  }

  return values;
}
