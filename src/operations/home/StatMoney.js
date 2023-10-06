import { Box } from '@mui/material'
import { Line } from 'react-chartjs-2';
import { CardStyle } from './utils/style'
import { createBasicConfig } from './utils/config';

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const data = {
  labels,
  datasets: [
    {
      label: 'Argent',
      data: labels.map(el => el.length * 4),
      backgroundColor: '#f58105',
      borderColor: '#f58105',
      borderWidth: 2 
    }
  ],
};

const config = {
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: 'Revenu',
      font:{ size:'16px' }
    },
  }
} 

function StatMoney(){
  return <Box sx={{ ...CardStyle, width:'100%', flex: 1, mt: 1 }}>
    <Line style={{ maxHeight:'300px' }} options={createBasicConfig(config)} data={data} />
  </Box>
}

export default StatMoney
