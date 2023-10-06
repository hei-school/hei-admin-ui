import { Box } from '@mui/material'
import { Line } from 'react-chartjs-2';
import { CardStyle } from './utils/style'
import { createBasicConfig } from './utils/config';
import authProvider from '../../providers/authProvider';
import { WhoamiRoleEnum } from '../../gen/haClient';

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

//mock
const data = {
  labels,
  datasets: [
    {
      label: 'Total',
      data: labels.map(el => el.length * 4),
      backgroundColor: '#f58105',
      borderColor: '#f58105',
      borderWidth: 2 
    },
    {
      label: 'Garçon',
      data: labels.map(el => el.length - 40),
      backgroundColor: '#2a2cb5',
      borderColor: '#2a2cb5',
      borderWidth: 2 
    },
    {
      label: 'Fille',
      data: labels.map(el => el.length * 2 - 5),
      backgroundColor: '#e31e37',
      borderColor: '#e31e37',
      borderWidth: 2 
    },
  ],
};


const getStudentConfig = ()=>{
  const role = authProvider.getCachedRole()
  const config = {
    plugins: {
      legend: { position: 'top', align: 'end' },
      title: {
        display: true,
        text: role !== WhoamiRoleEnum.Student ? 'Augmentation des étudiants' : 'Évolution de la moyenne',
        font:{ size:'20px' }
      },
    }
  }

  return createBasicConfig(config)
}

function StatStudent(){
  return <Box sx={{ ...CardStyle, flex: 1, mt: 1 }}>
    <Line style={{ maxHeight:'300px' }} options={getStudentConfig()} data={data} />
  </Box>
}

export default StatStudent
