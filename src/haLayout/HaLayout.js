import { Box } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { styled } from '@mui/styles';
import { mainTheme } from '../haTheme';
import HaAppBar from './appBar';
import HaMenu from './menu/';

const HaLayoutStyled = styled('div')({
  backgroundColor: '#ebe9e6',
  minHeight:'100vh',
  position:'relative',
  width:'100%'
})

const HaLayout = (props) => {
  const { children, title } = props
  return (
    <ThemeProvider theme={mainTheme}>
      <HaLayoutStyled>
        <HaMenu />
        <Box sx={{
          marginLeft: '250px', 
          width:'calc(100% - 250px)',
          display:'flex', 
          flexDirection:'column'}}
        >
          <HaAppBar title={title}/>
          {children}
        </Box>
      </HaLayoutStyled>
    </ThemeProvider>
  );
} 
export default HaLayout;
