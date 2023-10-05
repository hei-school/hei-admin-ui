import { Box } from '@mui/material'
import { Line } from 'react-chartjs-2';
import { CardStyle } from './style'
import { createBasicOptions } from './utils/stat.config';

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const config = {
  plugins: {
      legend: {
        position: 'top',
        align: 'end'
      },
      title: {
        display: true,
        text: 'Evolution du nombre d\'étudiants',
        font:{ size:'20px' }
      },
    }
} 

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

function StatStudent(){
  return <Box sx={{ ...CardStyle,maxWidth:'800px',flex: 2, mt: 1 }}>
    <Line style={{ maxHeight:'200px' }} options={createBasicOptions(config)} data={data} />
  </Box>
}

export default StatStudent
