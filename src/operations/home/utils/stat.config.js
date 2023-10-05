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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
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
  },
};

export const createBasicOptions = (options = {}) => {
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
