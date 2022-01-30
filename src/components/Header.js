import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Header = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', alignSelf: 'center', width: '65%' }}>
      <img src={require('../assets/images/pceLogo.png')} height={75} width={75} alt="PCE Logo" />
      <Typography
        variant="h4"
        align="center"
      >
        Pillai College of Engineering, New Panvel
      </Typography>
    </Box>
  );
}

export default Header;